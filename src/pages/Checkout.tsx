import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAppContext } from '@/contexts/AppContext';
import { ArrowLeft, CreditCard, Truck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StripePayment from '@/components/StripePayment';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useAppContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [stripeError, setStripeError] = useState<string | null>(null);
  const [sellerStripeAccountId, setSellerStripeAccountId] = useState<string | null>(null);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 5.99;
  const tax = total * 0.08;
  const finalTotal = total + shipping + tax;

  // Update helpers to use allow_shipping and local_pickup_only
  const allLocal = cartItems.every(item => item.product.local_pickup_only === true);
  const anyShipped = cartItems.some(item => item.product.allow_shipping === true);

  // Add a fallback for invalid delivery options
  const invalidDelivery = cartItems.some(item => !item.product.allow_shipping && !item.product.local_pickup_only);

  useEffect(() => {
    // Only call backend if there is at least one shipped item
    if (cartItems.length === 0) {
      setClientSecret(null);
      setSellerStripeAccountId(null);
      setStripeError(null);
      return;
    }
    if (anyShipped) {
      const fetchClientSecret = async () => {
        const response = await fetch('/.netlify/functions/create-payment-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: finalTotal,
            cartItems
          })
        });
        const data = await response.json();
        if (data.error) {
          setStripeError(data.error);
          setClientSecret(null);
          setSellerStripeAccountId(null);
        } else {
          setClientSecret(data.clientSecret);
          setSellerStripeAccountId(data.sellerStripeAccountId);
          setStripeError(null);
        }
      };
      fetchClientSecret();
    } else {
      setClientSecret(null);
      setSellerStripeAccountId(null);
      setStripeError(null);
    }
  }, [cartItems, finalTotal, anyShipped]);

  const handleStripeSuccess = () => {
    setPaymentSuccess(true);
    clearCart();
    navigate('/profile?tab=orders');
  };
  const handleStripeError = (error: string) => {
    alert('Payment failed: ' + error);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    clearCart();
    navigate('/profile?tab=orders');
  };

  if (invalidDelivery) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <p className="text-red-600 mb-4 font-bold">This item is not available for purchase. Please contact the seller.</p>
              <Button onClick={() => navigate('/')}>Return to Home</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-4">Your cart is empty</p>
              <Button onClick={() => navigate('/')}>Continue Shopping</Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" size="sm" onClick={() => navigate('/cart')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input id="address" placeholder="123 Main St" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="New York" />
                    </div>
                    <div>
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input id="zip" placeholder="10001" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {stripeError && (
                <div className="text-red-600 font-bold text-center mb-4">{stripeError}</div>
              )}
              {allLocal && !paymentSuccess && (
                <Button className="w-full" onClick={handlePlaceOrder} disabled={isProcessing}>
                  Mark as Paid (Local)
                </Button>
              )}
              {anyShipped && clientSecret && sellerStripeAccountId && !paymentSuccess && !stripeError && (
                <StripePayment
                  clientSecret={clientSecret}
                  amount={finalTotal}
                  onSuccess={handleStripeSuccess}
                  onError={handleStripeError}
                />
              )}
              {paymentSuccess && (
                <div className="text-green-600 font-bold text-center">Payment successful! Thank you for your order.</div>
              )}
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.title} x{item.quantity}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                  {allLocal && (
                    <Button 
                      className="w-full" 
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing...' : 'Place Order'}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;