import React, { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface Product {
  id: string;
  title: string;
  price?: number;
  description: string;
  status?: string;
  created_at: string;
  image_url?: string;
  video_url?: string;
  images?: string[];
  category?: string;
  category_slug?: string;
  type: 'product' | 'rental' | 'digital';
  // Rentals
  rent?: number | string;
  deposit?: number | string;
  utilities_paid?: boolean;
  lease_length?: string;
  pet_policy?: string;
  bedrooms?: number | string;
  bathrooms?: number | string;
  application_fee?: boolean;
  photo_urls?: string[];
  // Digital
  digital_file_url?: string;
}

interface ProductGridProps {
  categorySlug?: string;
  searchTerm?: string;
  products?: Product[];
  hideFilters?: boolean;
  hidePagination?: boolean;
  isAdmin?: boolean;
  userId?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ categorySlug, searchTerm, products: propProducts, hideFilters, hidePagination, isAdmin = false, userId }) => {
  const [products, setProducts] = useState<Product[]>(propProducts || []);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const productsPerPage = 20;

  useEffect(() => {
    if (propProducts) {
      setProducts(propProducts);
      setLoading(false);
      setHasMore(false);
      return;
    }
    setPage(1);
    setProducts([]);
    fetchProducts(1);
  }, [categorySlug, searchTerm, propProducts]);

  useEffect(() => {
    if (propProducts) return;
    if (page > 1) {
      fetchProducts(page);
    }
  }, [page, propProducts]);

  const shuffleArray = (array: Product[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchProducts = async (currentPage: number) => {
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
          ...p,
          type: 'product',
          price: p.price,
          images: Array.isArray(p.images) ? p.images : (typeof p.images === 'string' ? JSON.parse(p.images || '[]') : []),
          category_slug: p.category_slug || p.category || 'other',
        })));
      }
      // Rentals
      if (rentalsRes.data) {
        all = all.concat(rentalsRes.data.map((r: any) => ({
          ...r,
          type: 'rental',
          title: r.lease_length ? `${r.lease_length} Rental` : 'Rental',
          price: r.rent,
          images: r.photo_urls || [],
          category_slug: 'rentals',
        })));
      }
      // Digital Products
      if (digitalRes.data) {
        all = all.concat(digitalRes.data.map((d: any) => ({
          ...d,
          type: 'digital',
          price: d.price,
          images: d.photo_urls || [],
          category_slug: 'digital-products',
        })));
      }
      // Filter by categorySlug
      let filtered = all;
      if (categorySlug && categorySlug !== 'all') {
        filtered = all.filter(p => p.category_slug === categorySlug);
      }
      // Search term
      if (searchTerm) {
        filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      // Sort by created_at
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      // Pagination
      const paged = filtered.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);
      setProducts(prev => currentPage === 1 ? paged : [...prev, ...paged]);
      setHasMore(filtered.length > currentPage * productsPerPage);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  if (loading && page === 1) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products found for this category at this time.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
            }}
            isAdmin={isAdmin}
            userId={userId}
          />
        ))}
      </div>
      {!hidePagination && hasMore && !loading && (
        <div className="text-center">
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
      {!hidePagination && loading && page > 1 && (
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGrid;