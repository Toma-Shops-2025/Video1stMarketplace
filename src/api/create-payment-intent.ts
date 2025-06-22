import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';

const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
const PLATFORM_FEE_PERCENTAGE = 0.05; // 5% platform fee

interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    image_url: string;
    seller_id: string;
  };
}

export async function POST(req: Request) {
  try {
    const { items, userId }: { items: CartItem[]; userId: string } = await req.json();

    if (!items?.length || !userId) {
      return new Response(JSON.stringify({ error: 'Invalid request data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Group items by seller
    const itemsBySeller = items.reduce((acc: Record<string, CartItem[]>, item) => {
      const sellerId = item.product.seller_id;
      if (!acc[sellerId]) {
        acc[sellerId] = [];
      }
      acc[sellerId].push(item);
      return acc;
    }, {});

    // Create a payment intent for each seller
    const paymentIntents = await Promise.all(
      Object.entries(itemsBySeller).map(async ([sellerId, sellerItems]) => {
        // Get seller's Stripe account ID
        const { data: sellerData, error: sellerError } = await supabase
          .from('seller_accounts')
          .select('stripe_account_id')
          .eq('user_id', sellerId)
          .single();

        if (sellerError || !sellerData?.stripe_account_id) {
          throw new Error(`Seller ${sellerId} does not have a connected Stripe account`);
        }

        // Calculate total amount for this seller's items
        const sellerAmount = sellerItems.reduce((sum: number, item) => {
          return sum + (item.product.price * item.quantity);
        }, 0);

        // Create payment intent with application fee
        return stripe.paymentIntents.create({
          amount: Math.round(sellerAmount * 100), // Convert to cents
          currency: 'usd',
          metadata: {
            userId,
            sellerId,
            orderItems: JSON.stringify(sellerItems.map(item => ({
              productId: item.product_id,
              quantity: item.quantity
            })))
          },
          application_fee_amount: Math.round(sellerAmount * PLATFORM_FEE_PERCENTAGE * 100), // Platform fee
          // transfer_data: {
          //   destination: sellerData.stripe_account_id,
          // },
          // Funds will be held in the platform account until delivery is confirmed
        });
      })
    );

    // Create a combined client secret if multiple sellers
    let clientSecret: string;
    let paymentIntentId: string | undefined;
    let sellerStripeAccountId: string | undefined;
    if (paymentIntents.length === 1) {
      clientSecret = paymentIntents[0].client_secret!;
      paymentIntentId = paymentIntents[0].id;
      // Get the seller's Stripe account ID from the sellerData above
      // Since we already checked for it, we can get it from the items
      const sellerId = items[0].product.seller_id;
      const { data: sellerData } = await supabase
        .from('seller_accounts')
        .select('stripe_account_id')
        .eq('user_id', sellerId)
        .single();
      sellerStripeAccountId = sellerData?.stripe_account_id;
    } else {
      // For multi-seller, not implemented
      const totalAmount = items.reduce((sum: number, item) => {
        return sum + (item.product.price * item.quantity);
      }, 0);
      const combinedIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100),
        currency: 'usd',
        metadata: {
          userId,
          isMultiSeller: 'true',
          relatedIntents: paymentIntents.map(pi => pi.id).join(',')
        },
        transfer_group: `order_${Date.now()}` // Group related transfers
      });
      clientSecret = combinedIntent.client_secret!;
      paymentIntentId = combinedIntent.id;
      sellerStripeAccountId = undefined;
    }

    return new Response(JSON.stringify({
      clientSecret,
      paymentIntentId,
      sellerStripeAccountId
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(JSON.stringify({ error: 'Failed to create payment intent' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 