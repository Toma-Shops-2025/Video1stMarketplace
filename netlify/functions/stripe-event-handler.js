const { createClient } = require('@supabase/supabase-js');
const Stripe = require('stripe');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.handler = async (event) => {
  let rawBody = event.body;
  if (event.isBase64Encoded) {
    rawBody = Buffer.from(event.body, 'base64').toString('utf8');
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed.`, err.message);
    return {
      statusCode: 400,
      body: `Webhook Error: ${err.message}`,
    };
  }

  try {
    switch (stripeEvent.type) {
      case 'account.updated': {
        const account = stripeEvent.data.object;
        console.log('Stripe account.updated event received. Full account object:', JSON.stringify(account, null, 2));
        if (account.payouts_enabled) {
          const userId = account.metadata.userId;
          console.log('Extracted userId from account.metadata:', userId);
          if (!userId) {
            console.error('CRITICAL: No userId in account metadata for account.updated event. Cannot update profile.');
            break;
          }
          // Verify the user exists in Supabase Auth before proceeding
          const { data: authUser, error: authError } = await supabase.auth.admin.getUserById(userId);
          if (authError || !authUser) {
            console.error(`CRITICAL: User with ID ${userId} from Stripe metadata not found in Supabase Auth. Cannot update seller account.`, authError);
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
          } else {
            console.log(`Successfully upserted seller_accounts for user ${userId}`);
          }
        } else {
          console.log(`Account ${account.id} not fully onboarded yet (payouts not enabled). Skipping DB update.`);
        }
        break;
      }
      // Add more event types as needed
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