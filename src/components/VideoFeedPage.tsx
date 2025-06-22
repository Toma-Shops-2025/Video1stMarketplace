import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import supabase from '@/lib/supabase';
import VideoFeed from './VideoFeed';
import FeedNavigation from './FeedNavigation';

interface Category {
  id: string;
  name: string;
  image: string;
}

const VideoFeedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  const categoryId = searchParams.get('category');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1">
        <VideoFeed categoryId={categoryId || undefined} />
      </div>
    </div>
  );
};

export default VideoFeedPage;