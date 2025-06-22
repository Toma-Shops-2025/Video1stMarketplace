import React, { useRef } from 'react';
import CategoryCard from './CategoryCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const categories = [
  {
    title: "ALL ITEMS",
    slug: "all"
  },
  {
    title: "Books and Music",
    slug: "books-music"
  },
  {
    title: "Collectibles",
    slug: "collectibles"
  },
  {
    title: "Digital Products",
    slug: "digital-products"
  },
  {
    title: "Electronics",
    slug: "electronics"
  },
  {
    title: "Fashion",
    slug: "fashion"
  },
  {
    title: "Home and Garden",
    slug: "home-garden"
  },
  {
    title: "Rentals",
    slug: "rentals"
  },
  {
    title: "Sports and Outdoors",
    slug: "sports-outdoors"
  },
  {
    title: "Toys and Games",
    slug: "toys-games"
  },
  {
    title: "Vehicles",
    slug: "vehicles"
  },
  {
    title: "Everything Else",
    slug: "everything-else"
  }
];

// Category image mapping
const categoryImages: Record<string, string> = {
  'everything-else': '/images/everything-else.jpg.jpg',
  'rentals': '/images/rentals.jpg.jpg',
  'home-garden': '/images/home-garden.jpg.jpg',
  'collectibles': '/images/collectibles.jpg.jpg',
  'sports-outdoors': '/images/sports-outdoors.jpg.jpg',
  'toys-games': '/images/toys-games.jpg.jpg',
  'digital-products': '/images/digital-products.jpg.jpg',
  'books-music': '/images/books-music.jpg.jpg',
  'vehicles': '/images/vehicles.jpg.jpg',
  'fashion': '/images/fashion.jpg.jpg',
  'electronics': '/images/electronics.jpg.jpg',
};

const CategorySection: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full py-4 relative group">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Scroll buttons */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ transform: 'translate(50%, -50%)' }}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Scrollable container */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mb-4"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Custom card for 'ALL ITEMS' */}
          <div
            onClick={() => {
              // Navigate to all listings
              window.location.href = '/category/all';
            }}
            className="flex-none w-36 h-36 flex items-center justify-center rounded-lg cursor-pointer bg-gradient-to-br from-blue-500 to-purple-500 shadow-sm hover:shadow-md transition-all duration-300 border border-blue-400 hover:border-blue-700"
          >
            <span className="text-white text-lg font-bold text-center px-2 leading-tight drop-shadow-lg select-none">
              VIEW ALL<br />LISTINGS
            </span>
          </div>
          {/* Render the rest of the categories */}
          {categories.filter(category => category.slug !== 'all').map((category) => (
            <CategoryCard
              key={category.slug}
              title={category.title}
              slug={category.slug}
              image={categoryImages[category.slug] || '/placeholder.svg'}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySection; 