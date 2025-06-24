import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  // This is the critical fix to bypass RLS for this trusted server-side operation
  { auth: { persistSession: false } } 
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const handler = async ({ body, headers }) => {
  const sig = headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'account.updated':
        const account = stripeEvent.data.object;
        
        if (account.payouts_enabled) {
          const userId = account.metadata.userId;

          if (!userId) {
            console.error('CRITICAL: No userId in account metadata for account.updated event. Cannot update profile.');
            break; 
          }

          // Verify the user exists in Supabase Auth before proceeding
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);

          if (authError || !authUser) {
            console.error(`CRITICAL: User with ID ${userId} from Stripe metadata not found in Supabase Auth. Cannot update seller account.`, authError);
            // We'll break here and return a 200 to Stripe to prevent retries for a user that doesn't exist.
            break;
          }
          console.log(`User ${userId} verified in Supabase Auth. Proceeding with upsert.`);

          console.log(`Attempting to upsert profile for user ${userId} with Stripe account ${account.id}`);

          const { error } = await supabase
            .from('seller_accounts')
            .upsert({
              user_id: userId,
              payouts_enabled: true,
              stripe_account_id: account.id,
            }, {
              onConflict: 'user_id',
            });

          if (error) {
            console.error('CRITICAL: Supabase upsert failed.', error);
            return {
              statusCode: 500,
              body: JSON.stringify({
                error: 'Failed to update user profile in database. Supabase error follows.',
                details: error.message,
                code: error.code,
              }),
            };
          }

          console.log(`Successfully upserted profile for user ${userId}`);
        } else {
          console.log(`Account ${account.id} not fully onboarded yet (payouts not enabled). Skipping DB update.`);
        }
        break;

      case 'payment_intent.succeeded':
        console.log('Received payment_intent.succeeded event');
        const paymentIntent = stripeEvent.data.object;
        console.log('Full PaymentIntent object:', JSON.stringify(paymentIntent, null, 2));
        // Try to extract order info from metadata
        const meta = paymentIntent.metadata || {};
        const userId = meta.user_id || meta.userId || null;
        const items = meta.orderItems ? JSON.parse(meta.orderItems) : null;
        const shippingInfo = meta.shipping_info ? JSON.parse(meta.shipping_info) : null;
        const billingInfo = meta.billing_info ? JSON.parse(meta.billing_info) : null;
        const totalAmount = paymentIntent.amount ? paymentIntent.amount / 100 : null;
        const sellerStripeAccountId = meta.seller_stripe_account_id || null;
        const status = 'pending_delivery';

        if (userId && items) {
          const { error } = await supabase.from('orders').insert([
            {
              user_id: userId,
              total_amount: totalAmount,
              stripe_payment_intent_id: paymentIntent.id,
              status,
              shipping_info: shippingInfo,
              billing_info: billingInfo,
              items,
              seller_stripe_account_id: sellerStripeAccountId,
              payment_intent_id: paymentIntent.id,
            }
          ]);
          if (error) {
            console.error('Failed to insert order in Supabase:', JSON.stringify(error, null, 2));
          } else {
            console.log('Order created in Supabase for user', userId);
          }
        } else {
          console.error('Missing userId or items in PaymentIntent metadata. Order not created.');
        }
        break;
        
      default:
        console.log(`Unhandled event type ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Failed to process webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process webhook', details: error?.message }),
    };
  }
}; 