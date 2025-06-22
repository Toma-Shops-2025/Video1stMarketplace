import React from 'react';
import AdSenseAd from './AdSenseAd';

interface StandardAdProps {
  slot: string;
  title?: string;
  className?: string;
}

const StandardAd: React.FC<StandardAdProps> = ({ 
  slot, 
  title = 'Advertisement',
  className = '' 
}) => {
  return (
    <div className={`w-full py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-500 mb-4">{title}</p>
          <AdSenseAd 
            slot={slot}
            format="auto"
            responsive={true}
          />
        </div>
      </div>
    </div>
  );
};

export default StandardAd;