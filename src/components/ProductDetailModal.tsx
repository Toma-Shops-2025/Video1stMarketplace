import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, Share2, MessageCircle, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    title: string;
    price: number;
    seller: string;
    category: string;
    description?: string;
    location?: string;
    image?: string;
    thumbnail_url?: string;
  };
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ isOpen, onClose, product }) => {
  const navigate = useNavigate();
  const { addToCart } = useAppContext();

  if (!isOpen) return null;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.image || product.thumbnail_url || '/placeholder.svg'
    });
    
    toast({
      title: 'Added to Cart',
      description: `${product.title} has been added to your cart.`,
    });
    
    onClose();
    navigate('/cart');
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center">
      <div className="bg-white w-full md:w-96 md:rounded-t-xl rounded-t-xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">Product Details</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-xl font-bold">{product.title}</h2>
            <p className="text-2xl font-bold text-green-600">${product.price}</p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary">{product.category}</Badge>
            {product.location && <Badge variant="outline">{product.location}</Badge>}
          </div>

          <div>
            <p className="text-sm text-gray-600">Sold by</p>
            <p className="font-medium">{product.seller}</p>
          </div>

          {product.description && (
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-sm">{product.description}</p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button className="flex-1" onClick={handleBuyNow}>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Buy Now
            </Button>
            <Button variant="outline" size="icon">
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Share2 className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;