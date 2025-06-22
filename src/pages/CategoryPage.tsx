import React from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import ProductGrid from '@/components/ProductGrid';
import { categories } from '@/components/CategorySection';

const CategoryPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const category = categories.find(cat => cat.slug === slug);

  return (
    <AppLayout>
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">
          {category ? category.title : 'Category Not Found'}
        </h1>
        <ProductGrid categorySlug={slug} />
      </div>
    </AppLayout>
  );
};

export default CategoryPage; 