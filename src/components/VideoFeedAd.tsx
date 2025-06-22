import React from 'react';
import AdSenseAd from './AdSenseAd';

interface VideoFeedAdProps {
  position: 'top' | 'middle' | 'bottom';
}

const VideoFeedAd: React.FC<VideoFeedAdProps> = ({ position }) => {
  const getAdSlot = () => {
    switch (position) {
      case 'top': return '1234567890';
      case 'middle': return '1234567891';
      case 'bottom': return '1234567892';
      default: return '1234567890';
    }
  };

  return (
    <div className="w-full bg-gray-100 p-4 flex justify-center">
      <div className="max-w-sm w-full">
        <AdSenseAd 
          slot={getAdSlot()}
          format="rectangle"
          className="text-center"
        />
        <p className="text-xs text-gray-500 text-center mt-2">Advertisement</p>
      </div>
    </div>
  );
};

export default VideoFeedAd;