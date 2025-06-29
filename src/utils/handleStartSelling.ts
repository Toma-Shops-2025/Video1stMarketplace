import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

export function useHandleStartSelling() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to start selling.',
        variant: 'destructive',
      });
      return;
    }
    // Just go to the create listing page
    navigate('/sell');
  };
} 