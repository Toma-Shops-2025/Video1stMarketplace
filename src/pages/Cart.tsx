import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { StripePayment } from '@/components/StripePayment';
import supabase from '@/lib/supabase';

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

const Cart = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [sellerStripeAccountId, setSellerStripeAccountId] = useState<string | null>(null);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchCartItems = async () => {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select(`
            id,
            product_id,
            quantity,
            product:products (
              id,
              title,
              price,
              image_url,
              seller_id
            )
          `)
          .eq('user_id', user.id)
          .returns<CartItem[]>();

        if (error) throw error;
        setCartItems(data || []);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        toast({
          title: 'Error',
          description: 'Failed to load cart items',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [user, navigate]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(itemId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        title: 'Error',
        description: 'Failed to update quantity',
        variant: 'destructive'
      });
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;

      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing item:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item',
        variant: 'destructive'
      });
    }
  };

  const handleCheckout = async () => {
    console.log('handleCheckout called', { user, cartItems });
    if (!user) {
      toast({
        title: 'Not Logged In',
        description: 'Please sign in to proceed to checkout.',
        variant: 'destructive',
      });
      return;
    }

    console.log('Cart items length:', cartItems.length);

    if (cartItems.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Your cart is empty.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Log the cart payload before sending to backend
      console.log('Cart payload for checkout:', {
        items: cartItems,
        userId: user.id,
      });
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartItems,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize payment');
      }

      const data = await response.json();
      setStripeClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setSellerStripeAccountId(data.sellerStripeAccountId);
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to initialize payment',
        variant: 'destructive'
      });
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Create order
      const { error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id,
          items: cartItems,
          total_amount: totalAmount,
          status: 'paid',
          payment_method: 'stripe',
          payment_intent_id: paymentIntentId,
          seller_stripe_account_id: sellerStripeAccountId
        });

      if (orderError) throw orderError;

      // Clear cart items
      const { error: cartError } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user?.id);

      if (cartError) throw cartError;

      setCartItems([]);
      navigate('/orders');

      toast({
        title: 'Success',
        description: 'Payment successful! Your order has been placed.'
      });
    } catch (error) {
      console.error('Error processing successful payment:', error);
      toast({
        title: 'Error',
        description: 'Payment successful but there was an error creating your order. Please contact support.',
        variant: 'destructive'
      });
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p>Loading cart...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <p className="text-center text-gray-500">Your cart is empty</p>
              <Button
                onClick={() => navigate('/')}
                className="mt-4 mx-auto block"
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items</CardTitle>
              </CardHeader>
              <CardContent>
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                    <img
                      src={item.product.image_url}
                      alt={item.product.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product.title}</h3>
                      <p className="text-sm text-gray-500">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        -
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        +
                      </Button>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="py-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total</span>
                  <span className="text-xl font-bold">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>

                {stripeClientSecret ? (
                  <StripePayment
                    clientSecret={stripeClientSecret}
                    amount={totalAmount}
                    onSuccess={handlePaymentSuccess}
                    onError={(error) => toast({
                      title: 'Payment Error',
                      description: error,
                      variant: 'destructive'
                    })}
                  />
                ) : (
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                  >
                    Proceed to Payment
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Cart;