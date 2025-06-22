const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PLATFORM_FEE_PERCENTAGE = 0.05; // 5% platform fee

// Initialize Supabase client with correct backend environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }

  try {
    const { items, userId } = JSON.parse(event.body);

    if (!items?.length || !userId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid request: Missing items or userId' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const firstSellerId = items[0].product.seller_id;
    const allSameSeller = items.every(item => item.product.seller_id === firstSellerId);

    if (!allSameSeller) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Checkout with items from multiple sellers is not yet supported. Please create separate orders.' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const sellerId = firstSellerId;

    const { data: sellerAccount, error: sellerError } = await supabase
      .from('seller_accounts')
      .select('stripe_account_id, payouts_enabled')
      .eq('user_id', sellerId)
      .single();
    
    // Explicitly check if payouts are enabled
    if (sellerError || !sellerAccount?.stripe_account_id || !sellerAccount?.payouts_enabled) {
      console.error(`Seller payment information not found or incomplete for seller ${sellerId}`, sellerError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not find seller payment information.' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const sellerStripeAccountId = sellerAccount.stripe_account_id;

    const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const totalAmountInCents = Math.round(totalAmount * 100);

    const applicationFeeInCents = Math.round(totalAmountInCents * PLATFORM_FEE_PERCENTAGE);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountInCents,
      currency: 'usd',
      metadata: {
        userId,
        sellerId,
        orderItems: JSON.stringify(items.map(item => ({
          productId: item.product_id,
          quantity: item.quantity
        })))
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        sellerStripeAccountId: sellerStripeAccountId
      }),
      headers: { 'Content-Type': 'application/json' }
    };

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal error occurred while creating the payment intent.' }),
      headers: { 'Content-Type': 'application/json' }
    };
  }
};