import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';

interface EmailSenderProps {
  projectUrl?: string;
  fileName?: string;
}

export const EmailSender = ({ projectUrl, fileName }: EmailSenderProps) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const sendEmail = async () => {
    if (!email) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('sending');
    setMessage('Sending email...');

    try {
      const response = await fetch(
        'https://duzghrnrsgxcjodvqoiu.supabase.co/functions/v1/send-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            to: email,
            subject: `Your Project Download: ${fileName || 'Project Files'}`,
            projectUrl: projectUrl || window.location.href,
            fileName: fileName || 'Project Files'
          })
        }
      );

      if (response.ok) {
        setStatus('success');
        setMessage('Email sent successfully! Check your inbox.');
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to send email. Please try again or check your email address.');
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Send Link to Email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'sending'}
          />
          <Button 
            onClick={sendEmail} 
            disabled={status === 'sending' || !email}
            className="w-full"
          >
            {status === 'sending' ? (
              'Sending...'
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Download Link
              </>
            )}
          </Button>
        </div>
        
        {message && (
          <Alert className={status === 'error' ? 'border-red-500' : status === 'success' ? 'border-green-500' : ''}>
            {status === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : status === 'error' ? (
              <AlertCircle className="h-4 w-4" />
            ) : null}
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};