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
            console.error('CRITICAL: Supabase upsert failed. Error object as JSON:', JSON.stringify(error, null, 2));
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
        // This is a placeholder for future logic
        const paymentIntent = stripeEvent.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
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
      body: JSON.stringify({ error: 'Failed to process webhook' }),
    };
  }
}; 