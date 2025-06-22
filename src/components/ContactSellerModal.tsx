import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import AuthModal from '@/components/AuthModal';

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  productId: string;
  productTitle: string;
}

const ContactSellerModal: React.FC<ContactSellerModalProps> = ({
  isOpen,
  onClose,
  sellerId,
  productId,
  productTitle
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSend = async () => {
    console.log('[ContactSellerModal] sellerId:', sellerId);
    console.log('[ContactSellerModal] user:', user);
    console.log('[ContactSellerModal] message:', message);
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!message.trim()) {
      toast({ title: 'Error', description: 'Please enter a message', variant: 'destructive' });
      return;
    }

    // Validate that sellerId is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(sellerId)) {
      toast({ title: 'Error', description: 'Invalid seller information', variant: 'destructive' });
      return;
    }

    setLoading(true);
    try {
      // Send message using the messages table
      const messageContent = subject ? `${subject}: ${message}` : message;
      
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: sellerId,
        content: messageContent
      });

      if (error) throw error;

      toast({ title: 'Success', description: 'Message sent to seller!' });
      setMessage('');
      setSubject('');
      onClose();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Seller</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject (Optional)</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={`Inquiry about ${productTitle}`}
              />
            </div>
            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in this item..."
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={onClose} variant="outline" className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={loading} className="flex-1">
                {loading ? 'Sending...' : user ? 'Send Message' : 'Sign In to Send'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default ContactSellerModal;