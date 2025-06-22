import React from 'react';
import { Button } from '@/components/ui/button';
import { TrendingUp, Clock, Bookmark, Grid3X3 } from 'lucide-react';

interface FeedNavigationProps {
  activeFeed: 'trending' | 'new' | 'saved' | 'category';
  onFeedChange: (feed: 'trending' | 'new' | 'saved' | 'category') => void;
  categories: string[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
}

const FeedNavigation: React.FC<FeedNavigationProps> = ({
  activeFeed,
  onFeedChange,
  categories,
  activeCategory,
  onCategoryChange
}) => {
  return (
    <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent">
      {/* Main Feed Tabs */}
      <div className="flex justify-center pt-12 pb-4">
        <div className="flex bg-black/50 rounded-full p-1">
          <Button
            variant={activeFeed === 'trending' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFeedChange('trending')}
            className={`rounded-full px-4 ${activeFeed === 'trending' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Trending
          </Button>
          
          <Button
            variant={activeFeed === 'new' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFeedChange('new')}
            className={`rounded-full px-4 ${activeFeed === 'new' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
          >
            <Clock className="w-4 h-4 mr-1" />
            New
          </Button>
          
          <Button
            variant={activeFeed === 'saved' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFeedChange('saved')}
            className={`rounded-full px-4 ${activeFeed === 'saved' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
          >
            <Bookmark className="w-4 h-4 mr-1" />
            Saved
          </Button>
          
          <Button
            variant={activeFeed === 'category' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onFeedChange('category')}
            className={`rounded-full px-4 ${activeFeed === 'category' ? 'bg-white text-black' : 'text-white hover:bg-white/20'}`}
          >
            <Grid3X3 className="w-4 h-4 mr-1" />
            Categories
          </Button>
        </div>
      </div>
      
      {/* Category Selector */}
      {activeFeed === 'category' && (
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange?.(category)}
                className={`whitespace-nowrap rounded-full ${
                  activeCategory === category 
                    ? 'bg-blue-600 text-white' 
                    : 'border-white/50 text-white hover:bg-white/20'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedNavigation;