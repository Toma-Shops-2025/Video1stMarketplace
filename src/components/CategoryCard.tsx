import React from 'react';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
  title: string;
  slug: string;
  image: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, slug, image }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/category/${slug}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="flex-none w-36 h-36 flex flex-col items-center justify-center rounded-lg cursor-pointer bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-500"
    >
      <img src={image} alt={title} className="w-full h-full object-cover rounded-lg" />
    </div>
  );
};

export default CategoryCard; 