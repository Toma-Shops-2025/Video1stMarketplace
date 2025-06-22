const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Initialize Stripe and Supabase clients with backend environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const PLATFORM_FEE_PERCENTAGE = 0.05; // 5% platform fee

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { paymentIntentId, sellerId } = JSON.parse(event.body);

    if (!paymentIntentId || !sellerId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Missing paymentIntentId or sellerId' }) };
    }

    // 1. Fetch the seller's Stripe account ID from your database
    const { data: sellerAccount, error: accountError } = await supabase
      .from('seller_accounts')
      .select('stripe_account_id')
      .eq('user_id', sellerId)
      .single();

    if (accountError || !sellerAccount || !sellerAccount.stripe_account_id) {
      console.error('Error fetching seller account or Stripe account ID not found:', accountError);
      return { statusCode: 404, body: JSON.stringify({ error: "Could not find seller's Stripe account." }) };
    }
    
    const sellerStripeAccountId = sellerAccount.stripe_account_id;

    // 2. Retrieve the Payment Intent to get the total amount charged
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const totalAmountInCents = paymentIntent.amount;

    // 3. Calculate the platform fee and the amount to transfer to the seller
    const applicationFeeInCents = Math.round(totalAmountInCents * PLATFORM_FEE_PERCENTAGE);
    const amountToTransferInCents = totalAmountInCents - applicationFeeInCents;

    // 4. Create the Transfer to the seller's account
    const transfer = await stripe.transfers.create({
      amount: amountToTransferInCents,
      currency: 'usd',
      destination: sellerStripeAccountId,
      source_transaction: paymentIntent.charges.data[0].id, // Link the transfer to the original charge
    });

    // (Optional but Recommended) Update your database to mark the order as 'completed' or 'funds_released'
    // e.g., await supabase.from('orders').update({ status: 'completed' }).eq('payment_intent_id', paymentIntentId);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, transferId: transfer.id }),
    };

  } catch (error) {
    console.error('Error releasing funds:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}; 