import React, { useEffect, useState } from 'react';
import AppLayout from '@/components/AppLayout';
import HeroSection from '@/components/HeroSection';
import ProductGrid from '@/components/ProductGrid';
import CategorySection from '@/components/CategorySection';
import HowItWorksSection from '@/components/HowItWorksSection';
import VideoFeed from '@/components/VideoFeed';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('id', user.id)
        .single();
      setIsAdmin(!!data && !error);
    };
    checkAdmin();
  }, [user]);

  return (
    <AppLayout>
      <HeroSection />
      <CategorySection />
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductGrid isAdmin={isAdmin} userId={user?.id} />
      </div>
    </AppLayout>
  );
};

export default Index;