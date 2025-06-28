import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import supabase from '@/lib/supabase';
import CommentModal from './CommentModal';
import ContactSellerModal from './ContactSellerModal';

interface Product {
  id: string;
  title: string;
  price: string;
  video_url: string;
  thumbnail_url: string;
  seller_id: string;
  description: string;
}

interface VideoFeedItemProps {
  product: Product;
  isActive: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

const VideoFeedItem: React.FC<VideoFeedItemProps> = ({ product, isActive }) => {
  const { toggleLike, shareProduct, likedProducts } = useAppContext();
  const navigate = useNavigate();
  const [showComments, setShowComments] = useState(false);
  const [showContactSeller, setShowContactSeller] = useState(false);
  
  if (!isActive) return null;

  const handleViewListing = () => {
    navigate(`/product/${product.id}`);
  };

  const getVideoUrl = (videoPath: string) => {
    if (videoPath.startsWith('http')) {
      if (videoPath.includes('video.pictory.ai')) {
        console.log('Processing Pictory video URL:', videoPath);
        const embedUrl = videoPath.replace('video.pictory.ai', 'video.pictory.ai/embed');
        console.log('Generated embed URL:', embedUrl);
        return embedUrl;
      }
      return videoPath;
    }
    const { data } = supabase.storage
      .from('listing-videos')
      .getPublicUrl(videoPath);
    return data.publicUrl;
  };

  const getThumbnailUrl = (thumbnailPath: string) => {
    if (thumbnailPath.startsWith('http')) {
      return thumbnailPath;
    }
    const { data } = supabase.storage
      .from('listing-images')
      .getPublicUrl(thumbnailPath);
    return data.publicUrl;
  };

  const getEmbeddableUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId[1]}/preview`;
      }
    }
    if (url.includes('video.pictory.ai')) {
      console.log('Using Pictory embed URL:', url);
      return url;
    }
    return url;
  };

  const isLiked = likedProducts.includes(product.id);
  const videoUrl = getVideoUrl(product.video_url);
  console.log('Video URL after processing:', videoUrl);
  const thumbnailUrl = getThumbnailUrl(product.thumbnail_url);
  const embeddableUrl = getEmbeddableUrl(videoUrl);
  console.log('Final embeddable URL:', embeddableUrl);
  const isGoogleDrive = videoUrl.includes('drive.google.com');
  const isTikTok = videoUrl.includes('tiktok.com');
  const isPictory = videoUrl.includes('video.pictory.ai');

  return (
    <>
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <div className="relative w-full max-w-md mx-auto h-full">
          {isTikTok ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-center text-white p-8">
                <p className="text-lg mb-4">TikTok Video</p>
                <p className="text-sm opacity-75 mb-4">Click "View Listing" to see more details</p>
                <img 
                  src={thumbnailUrl || '/placeholder.svg'}
                  alt={product.title}
                  className="w-full max-w-xs mx-auto rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
            </div>
          ) : isGoogleDrive || isPictory ? (
            <iframe
              src={embeddableUrl}
              className="w-full h-full"
              allow="autoplay; fullscreen"
              allowFullScreen
              title={product.title}
            />
          ) : (
            <video
              src={videoUrl}
              poster={thumbnailUrl}
              className="w-full h-full object-cover"
              controls
              autoPlay
              loop
              onError={(e) => {
                console.error('Video failed to load:', videoUrl);
                const target = e.target as HTMLVideoElement;
                target.style.display = 'none';
                const img = document.createElement('img');
                img.src = thumbnailUrl || '/placeholder.svg';
                img.className = 'w-full h-full object-cover';
                img.alt = product.title;
                target.parentNode?.appendChild(img);
              }}
            />
          )}
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="text-white space-y-3">
              <h3 className="font-bold text-lg">{product.title}</h3>
              <p className="text-green-400 font-bold text-xl">${parseFloat(product.price).toFixed(0)}</p>
              <p className="text-sm opacity-90 line-clamp-2">{product.description}</p>
              <p className="text-xs opacity-75">Seller: {product.seller_id.slice(0, 12)}</p>
              
              <div className="flex space-x-2 mt-3">
                <Button 
                  onClick={handleViewListing}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg flex-1"
                >
                  View Listing
                </Button>
              </div>
              
              <Button 
                onClick={() => setShowContactSeller(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg mt-2"
              >
                <Mail className="w-4 h-4 mr-2" />
                Contact Seller
              </Button>
            </div>
          </div>
          
          <div className="absolute right-4 bottom-32 flex flex-col space-y-4">
            <Button 
              onClick={() => setShowComments(true)}
              size="sm" 
              variant="ghost" 
              className="rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button 
              onClick={() => shareProduct(product)}
              size="sm" 
              variant="ghost" 
              className="rounded-full bg-white/20 text-white hover:bg-white/30"
            >
              <Share className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
      
      <CommentModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        productId={product.id}
        productTitle={product.title}
      />
      
      <ContactSellerModal
        isOpen={showContactSeller}
        onClose={() => setShowContactSeller(false)}
        sellerId={product.seller_id}
        productId={product.id}
        productTitle={product.title}
      />
    </>
  );
};

export default VideoFeedItem;