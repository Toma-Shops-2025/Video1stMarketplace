import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import supabase from '@/lib/supabase';
import { Product } from '@/types';
import { AspectRatio } from "@/components/ui/aspect-ratio"

interface Product {
  id: string;
  title: string;
  price: number;
  image_url?: string;
  thumbnail_url?: string;
  video_url?: string;
  images?: string[];
  description: string;
  seller_id?: string;
}

interface ProductCardProps {
  product: Product;
  isAdmin?: boolean;
  userId?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isAdmin = false, userId }) => {
  const navigate = useNavigate();
  const isSeller = userId && product && product.seller_id && userId === product.seller_id;
  const canEditOrDelete = isAdmin || isSeller;
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-product/${product.id}`);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    const { error } = await supabase.from('products').delete().eq('id', product.id);
    if (!error) {
      window.location.reload();
    } else {
      alert('Failed to delete listing.');
    }
  };

  // Get the proper image URL
  const getImageUrl = () => {
    // If we have a video thumbnail, use it
    if (product.video_url) {
      return product.thumbnail_url;
    }
    
    // Check if we have images array with URLs
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0];
      // If it's already a full URL, use it
      if (firstImage.startsWith('http')) {
        return firstImage;
      }
      // Otherwise, construct the Supabase storage URL
      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(firstImage);
      return data.publicUrl;
    }
    
    // Fallback to image_url
    if (product.image_url && product.image_url.startsWith('http')) {
      return product.image_url;
    }
    
    return '/placeholder.svg';
  };

  const imageUrl = getImageUrl();
  const hasVideo = !!product.video_url;

  return (
    <div 
      className="relative group cursor-pointer overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
      onClick={handleClick}
    >
      <div className="aspect-[3/4] relative">
        <img 
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder.svg';
          }}
        />
        {hasVideo && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-2">
            <Play className="w-4 h-4 text-white" />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-medium text-sm line-clamp-2 mb-1">
            {product.title}
          </h3>
          <div className="flex items-baseline gap-1">
            <span className="text-white text-xs">$</span>
            <span className="text-white text-lg font-bold">
              {product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      {canEditOrDelete && (
        <div className="absolute top-2 left-2 flex gap-2 z-10">
          <button onClick={handleEdit} className="bg-yellow-400 hover:bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">Edit</button>
          <button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">Delete</button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;