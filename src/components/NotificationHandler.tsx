import { useEffect, useState } from 'react';
import { requestNotificationPermission, onMessageListener } from '../config/firebase';
import { toast } from 'sonner';
import { MessagePayload } from 'firebase/messaging';

interface NotificationHandlerProps {
  onNotificationReceived?: (notification: MessagePayload) => void;
}

export default function NotificationHandler({ onNotificationReceived }: NotificationHandlerProps) {
  const [isTokenFound, setTokenFound] = useState(false);

  useEffect(() => {
    const initializeNotifications = async () => {
      try {
        const token = await requestNotificationPermission();
        if (token) {
          setTokenFound(true);
          // Here you would typically send this token to your backend
          console.log('Notification token:', token);
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();
  }, []);

  useEffect(() => {
    const messageListener = onMessageListener();
    
    messageListener.then((payload: MessagePayload) => {
      console.log('Received foreground message:', payload);
      
      // Show a toast notification
      toast(payload?.notification?.title || 'New Message', {
        description: payload?.notification?.body,
        action: {
          label: 'View',
          onClick: () => onNotificationReceived?.(payload)
        },
      });
    });

    return () => {
      // No explicit cleanup needed as the promise resolves only once
    };
  }, [onNotificationReceived]);

  return null; // This is a background component
} 