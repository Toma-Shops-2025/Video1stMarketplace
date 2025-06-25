import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, MessageCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';
import { Message } from '@/types';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
}

interface Conversation {
  other_user_id: string;
  other_user_email: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface MessagesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MessagesModal: React.FC<MessagesModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      loadConversations();
    }
  }, [isOpen, user]);

  useEffect(() => {
    if (selectedUserId && user) {
      loadMessages(selectedUserId);
    }
  }, [selectedUserId, user]);

  const loadConversations = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, Conversation>();
      
      for (const message of messagesData || []) {
        const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        
        if (!conversationMap.has(otherUserId)) {
          const unreadCount = (messagesData || []).filter(
            m => m.sender_id === otherUserId && m.receiver_id === user.id && !m.read
          ).length;
          
          conversationMap.set(otherUserId, {
            other_user_id: otherUserId,
            other_user_email: 'User', // We'll improve this later
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: unreadCount
          });
        }
      }
      
      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast({
        title: 'Error',
        description: 'Failed to load conversations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (otherUserId: string) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      
      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', otherUserId)
        .eq('receiver_id', user.id)
        .eq('read', false);
        
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUserId || !user) return;
    
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedUserId,
          content: newMessage.trim()
        });

      if (error) throw error;
      
      setNewMessage('');
      loadMessages(selectedUserId);
      loadConversations();
      
      toast({
        title: 'Message sent',
        description: 'Your message has been sent successfully'
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive'
      });
    }
  };

  const selectedConversation = conversations.find(c => c.other_user_id === selectedUserId);

  const registerForPushNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast({ title: 'Error', description: 'Push notifications are not supported in this browser.', variant: 'destructive' });
      return;
    }
    try {
      // Make sure you have VITE_FIREBASE_VAPID_KEY set in your .env file
      const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
      if (!vapidKey) {
        toast({ title: 'Error', description: 'VAPID key is not set. Please set VITE_FIREBASE_VAPID_KEY in your .env file.', variant: 'destructive' });
        return;
      }
      const registration = await navigator.serviceWorker.register('/sw.js');
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey
      });
      // Save the push token to Supabase
      const { error } = await supabase.from('push_tokens').upsert({
        user_id: user.id,
        token: JSON.stringify(subscription)
      });
      if (error) throw error;
      toast({ title: 'Success', description: 'Device registered for push notifications!' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to register for push notifications', variant: 'destructive' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[600px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center space-x-2">
            <MessageCircle className="w-5 h-5" />
            <span>Messages</span>
            <Button size="sm" variant="outline" onClick={registerForPushNotifications} className="ml-4">Enable Push Notifications</Button>
          </DialogTitle>
          <DialogDescription>View and send messages to other users.</DialogDescription>
        </DialogHeader>
        
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <ScrollArea className="h-full p-4">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No messages yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start a conversation by contacting a seller
                  </p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.other_user_id}
                    className={`p-3 rounded-lg cursor-pointer hover:bg-gray-50 ${
                      selectedUserId === conv.other_user_id ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                    onClick={() => setSelectedUserId(conv.other_user_id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {conv.other_user_email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{conv.other_user_email}</p>
                        <p className="text-xs text-gray-500 truncate">{conv.last_message}</p>
                      </div>
                      {conv.unread_count > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </ScrollArea>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            {selectedUserId ? (
              <>
                <div className="p-4 border-b">
                  <h3 className="font-medium">{selectedConversation?.other_user_email}</h3>
                </div>
                
                <ScrollArea className="flex-1 p-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.sender_id === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
                
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 min-h-[60px]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessagesModal;