import React from 'react';

interface AdSenseAdProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  className?: string;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '' 
}) => {
  return (
    <div 
      className={`adsense-container ${className} bg-gray-50 border border-dashed border-gray-200 p-4 text-center text-gray-400 text-sm`}
    >
      <p>Ad Space Reserved</p>
      <p className="text-xs mt-1 text-gray-300">Slot: {slot}</p>
    </div>
  );
};

export default AdSenseAd;