const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PLATFORM_FEE_PERCENTAGE = 0; // 0% platform fee

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
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

    const { data: sellerProfile, error: sellerError } = await supabase
      .from('seller_accounts')
      .select('stripe_account_id')
      .eq('user_id', sellerId)
      .single();

    if (sellerError || !sellerProfile?.stripe_account_id) {
      console.error(`Could not find Stripe account for seller ${sellerId}`, sellerError);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Could not find seller payment information.' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const sellerStripeAccountId = sellerProfile.stripe_account_id;

    const totalAmount = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const totalAmountInCents = Math.round(totalAmount * 100);

    const applicationFeeInCents = Math.round(totalAmountInCents * PLATFORM_FEE_PERCENTAGE);

    // Check if all items are local-only
    const allLocal = items.every(item => item.product.local_pickup_only === true);
    if (allLocal) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No payment needed for local transactions.' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }
    // Only proceed with Stripe logic if at least one item has allow_shipping === true
    const anyShipped = items.some(item => item.product.allow_shipping === true);
    if (!anyShipped) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No shippable items found in cart.' }),
        headers: { 'Content-Type': 'application/json' }
      };
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmountInCents,
      currency: 'usd',
      application_fee_amount: applicationFeeInCents,
      transfer_data: {
        destination: sellerStripeAccountId,
      },
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