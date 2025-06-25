import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface StripeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  message?: string;
}

// NOTE: This modal is only triggered on form submit if Allow Shipping is selected and the seller is not Stripe onboarded.
const StripeOnboardingModal: React.FC<StripeOnboardingModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  message,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect with Stripe to Sell</DialogTitle>
          <DialogDescription>
            {message || (
              <>
                To sell items and receive payments for shipped orders, TomaShops partners with Stripe, a trusted payment processor.<br /><br />
                <strong>Note:</strong> You only need a Stripe account to receive payments for shipped items. For local deals, you can get paid in person and do not need Stripe.<br /><br />
                <strong>TomaShops does not charge any fees to buyers or sellers.</strong><br /><br />
                You'll now be redirected to Stripe to set up your account. Once completed, you'll be brought right back to continue listing your item.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? 'Redirecting...' : 'Continue to Stripe'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StripeOnboardingModal; 