import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);

export async function POST(req: Request) {
  try {
    const { orderId, sellerStripeAccountId, amount, paymentIntentId } = await req.json();

    // Optionally, check that the order exists and is eligible for release
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();
    if (orderError || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), { status: 404 });
    }
    if (order.status !== 'delivered') {
      return new Response(JSON.stringify({ error: 'Order not eligible for release' }), { status: 400 });
    }

    // Create a Stripe transfer to the seller
    const transfer = await stripe.transfers.create({
      amount, // in cents
      currency: 'usd',
      destination: sellerStripeAccountId,
      source_transaction: paymentIntentId, // links the transfer to the original payment
    });

    // Update order status to 'released'
    await supabase
      .from('orders')
      .update({ status: 'released' })
      .eq('id', orderId);

    return new Response(JSON.stringify({ success: true, transfer }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error releasing funds:', error);
    return new Response(JSON.stringify({ error: 'Failed to release funds' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 