import { useEffect, useState } from 'react';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { getStripe } from '../config/stripe';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface PaymentFormProps {
  amount: number;
  sellerId: string;
  metadata: Record<string, string>;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: Error) => void;
}

export function PaymentForm({ amount, sellerId, metadata, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    fetch('/.netlify/functions/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        sellerId,
        metadata,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Error:', error);
        onError?.(error);
        toast({
          variant: "destructive",
          title: "Error creating payment",
          description: error.message,
        });
      });
  }, [amount, sellerId, metadata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`,
        },
      });

      if (error) {
        onError?.(error);
        toast({
          variant: "destructive",
          title: "Payment failed",
          description: error.message,
        });
      } else if (paymentIntent) {
        onSuccess?.(paymentIntent.id);
        toast({
          title: "Payment successful",
          description: "Your payment has been processed successfully.",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      onError?.(error as Error);
      toast({
        variant: "destructive",
        title: "Error processing payment",
        description: (error as Error).message,
      });
    }

    setIsLoading(false);
  };

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <PaymentElement />
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full"
      >
        {isLoading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
} 