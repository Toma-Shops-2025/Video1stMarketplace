import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

interface Category {
  id: string;
  name: string;
  image: string;
}

const categoryImages: { [key: string]: string } = {
  "Electronics": "/images/electronics.jpg.jpg",
  "Fashion": "/images/fashion.jpg.jpg",
  "Home & Garden": "/images/home-garden.jpg.jpg",
  "Sports & Outdoors": "/images/sports-outdoors.jpg.jpg",
  "Toys & Games": "/images/toys-games.jpg.jpg",
  "Books & Music": "/images/books-music.jpg.jpg",
  "Vehicles": "/images/vehicles.jpg.jpg",
  "Collectibles": "/images/collectibles.jpg.jpg",
  "Digital Products": "/images/digital-products.jpg.jpg",
  "Rentals": "/images/rentals.jpg.jpg",
  "Everything Else": "/images/everything-else.jpg.jpg",
};

const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [productCounts, setProductCounts] = useState<{[key: string]: number}>({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, image')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
      
      // Fetch product counts for each category
      if (data) {
        const counts: {[key: string]: number} = {};
        for (const category of data) {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('status', 'active');
          counts[category.id] = count || 0;
        }
        setProductCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading categories...</div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link key={category.id} to={`/feed?category=${category.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow group">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={categoryImages[category.name] || category.image || '/placeholder.svg'}
                      alt={category.name}
                      className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                      crossOrigin="anonymous"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-30 transition-all duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                      <p className="text-white text-sm opacity-90">
                        {productCounts[category.id] || 0} items
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;