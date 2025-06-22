import { useState } from 'react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

interface SellerOnboardingProps {
  userId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function SellerOnboarding({ userId, onSuccess, onError }: SellerOnboardingProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleOnboarding = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/.netlify/functions/create-account-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create Stripe account');
      }

      // Redirect to Stripe onboarding
      window.location.href = data.accountLink;
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      onError?.(error as Error);
      toast({
        variant: "destructive",
        title: "Onboarding failed",
        description: (error as Error).message,
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-2xl font-bold">Become a Seller</h2>
      <p className="text-gray-600 text-center max-w-md">
        To start selling on our platform, you'll need to set up your Stripe account.
        This will allow you to receive payments securely.
      </p>
      <Button
        onClick={handleOnboarding}
        disabled={isLoading}
        className="w-full max-w-sm"
      >
        {isLoading ? 'Setting up...' : 'Set up Stripe Account'}
      </Button>
    </div>
  );
} 