import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export function useHandleStartSelling() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to start selling.',
        variant: 'destructive',
      });
      return;
    }
    // Check if user is Stripe-connected and payouts enabled
    const { data } = await supabase
      .from('seller_accounts')
      .select('stripe_account_id, payouts_enabled')
      .eq('user_id', user.id)
      .single();
    if (!data || !data.stripe_account_id || !data.payouts_enabled) {
      toast({
        title: 'Stripe Onboarding Required',
        description: 'You only need to do this once. It is very quick and ensures you can get paid for any shipped items you sell.',
        variant: 'default',
      });
      const res = await fetch('/.netlify/functions/stripe-onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const result = await res.json();
      if (result.accountLink) {
        window.location.href = result.accountLink;
      } else {
        toast({ title: 'Error', description: result.error || 'Failed to get Stripe onboarding link', variant: 'destructive' });
      }
      return;
    }
    // Already onboarded
    navigate('/sell');
  };
} 