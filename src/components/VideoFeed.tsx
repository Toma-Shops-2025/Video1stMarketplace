import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import supabase from '@/lib/supabase';
import VideoFeedItem from './VideoFeedItem';
import { Product } from '@/types';

interface VideoFeedProps {
  categoryId?: string;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ categoryId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, [categoryId]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch from all three tables
      const [productsRes, rentalsRes, digitalRes] = await Promise.all([
        supabase.from('products').select('*').eq('status', 'active').order('created_at', { ascending: false }),
        supabase.from('rentals').select('*').order('created_at', { ascending: false }),
        supabase.from('digital_products').select('*').order('created_at', { ascending: false })
      ]);
      let all: Product[] = [];
      // Products
      if (productsRes.data) {
        all = all.concat(productsRes.data.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: p.price?.toString() || '',
          video_url: p.video_url || '',
          image_url: p.image_url || p.thumbnail_url || '/placeholder.svg',
          seller_id: p.seller_id,
          description: p.description || '',
          type: 'product',
          created_at: p.created_at,
          category_slug: p.category_slug || p.category || 'other',
        })));
      }
      // Rentals
      if (rentalsRes.data) {
        all = all.concat(rentalsRes.data.map((r: any) => ({
          id: r.id,
          title: r.lease_length ? `${r.lease_length} Rental` : 'Rental',
          price: r.rent?.toString() || '',
          video_url: r.video_url || '',
          image_url: (r.photo_urls && r.photo_urls[0]) || '/placeholder.svg',
          seller_id: r.user_id,
          description: r.description || '',
          type: 'rental',
          created_at: r.created_at,
          category_slug: 'rentals',
        })));
      }
      // Digital Products
      if (digitalRes.data) {
        all = all.concat(digitalRes.data.map((d: any) => ({
          id: d.id,
          title: d.title,
          price: d.price?.toString() || '',
          video_url: d.video_url || '',
          image_url: (d.photo_urls && d.photo_urls[0]) || '/placeholder.svg',
          seller_id: d.user_id,
          description: d.description || '',
          type: 'digital',
          created_at: d.created_at,
          category_slug: 'digital-products',
        })));
      }
      // Only include items with a video_url
      let filtered = all.filter(p => p.video_url && p.video_url.trim() !== '');
      // Filter by categoryId if provided
      if (categoryId && categoryId !== 'all') {
        filtered = filtered.filter(p => p.category_slug === categoryId);
      }
      // Sort by created_at
      filtered.sort((a, b) => new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime());
      setProducts(filtered);
    } catch (error) {
      console.error('Error fetching video products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading videos...</div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-2">No videos available</p>
          <p className="text-gray-400">Check back later for new content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      {products.map((product, index) => (
        <VideoFeedItem
          key={product.id}
          product={{ ...product, thumbnail_url: product.image_url }}
          isActive={index === currentIndex}
          onNext={goToNext}
          onPrevious={goToPrevious}
        />
      ))}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-4 z-10">
        <Button
          onClick={goToPrevious}
          size="sm"
          variant="ghost"
          className="rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          <ChevronUp className="h-6 w-6" />
        </Button>
        <Button
          onClick={goToNext}
          size="sm"
          variant="ghost"
          className="rounded-full bg-white/20 text-white hover:bg-white/30"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default VideoFeed;