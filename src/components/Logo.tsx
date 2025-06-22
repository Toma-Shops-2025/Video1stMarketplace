import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  color?: 'white' | 'black';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showTagline = false, color = 'black' }) => {
  const textSize = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl',
    xl: 'text-6xl'
  }[size];
  
  const cartSize = size === 'sm' 
    ? 'w-4 h-4' 
    : size === 'lg' 
    ? 'w-6 h-6' 
    : 'w-10 h-10';
  
  const taglineSize = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-lg',
    xl: 'text-xl'
  }[size];
  
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center justify-center">
        <span className={`${textSize} font-bold text-${color}`}>T</span>
        <span className={`${textSize} font-bold text-${color}`}>O</span>
        <span className={`${textSize} font-bold text-${color}`}>M</span>
        <span className={`${textSize} font-bold text-${color}`}>A</span>
        <span className={`${textSize} font-bold text-[#00C9B5]`}>Shops</span>
        <ShoppingCart className={`${cartSize} ml-1 text-[#00C9B5]`} />
      </div>
      {showTagline && (
        <span className={`${taglineSize} text-${color} mt-2 text-center`}>Video 1st Marketplace</span>
      )}
    </div>
  );
};

export default Logo; 