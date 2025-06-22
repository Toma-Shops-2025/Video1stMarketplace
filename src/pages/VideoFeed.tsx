import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { AppProvider } from '@/contexts/AppContext';
import VideoFeedPage from '@/components/VideoFeedPage';

const VideoFeed: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <VideoFeedPage />
          <Button 
            onClick={() => navigate('/')} 
            variant="ghost" 
            className="mt-8"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </AppProvider>
  );
};

export default VideoFeed;