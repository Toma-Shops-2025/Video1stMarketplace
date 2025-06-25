import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Share2, MessageCircle, ShoppingCart, ArrowLeft, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';
import { Product } from '@/types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import supabase from '@/lib/supabase';
import ContactSellerModal from '@/components/ContactSellerModal';

interface Product {
  id: string;
  title: string;
  price: string;
  seller_id: string;
  category: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  image_url?: string;
  images?: string[];
  status: string;
  created_at: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, toggleLike, shareProduct, likedProducts } = useAppContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContactSeller, setShowContactSeller] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [productIds, setProductIds] = useState<string[]>([]);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const fetchProductAndIds = async () => {
      if (!id) return;
      
      setLoading(true);

      try {
        // Fetch all active product IDs
        const { data: idsData, error: idsError } = await supabase
          .from('products')
          .select('id')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (idsError) throw idsError;
        setProductIds(idsData.map(p => p.id));

        // Fetch current product details
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .eq('status', 'active')
          .maybeSingle();

        if (productError) throw productError;
        if (!productData) {
          navigate('/video-feed');
          return;
        }
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product data:', error);
        navigate('/video-feed');
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndIds();
  }, [id, navigate]);

  const handleNextListing = () => {
    if (!product || productIds.length === 0) return;
    const currentIndex = productIds.indexOf(product.id);
    if (currentIndex > -1 && currentIndex < productIds.length - 1) {
      const nextProductId = productIds[currentIndex + 1];
      navigate(`/product/${nextProductId}`);
    } else if (currentIndex === productIds.length - 1) {
      // Optional: loop back to the first product
      const nextProductId = productIds[0];
      navigate(`/product/${nextProductId}`);
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    navigate('/cart');
  };

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const showNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prevIndex => (prevIndex + 1) % displayImages.length);
  };

  const showPrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex(prevIndex => (prevIndex - 1 + displayImages.length) % displayImages.length);
  };

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    const { data } = supabase.storage
      .from('product-images')
      .getPublicUrl(imagePath);
    return data.publicUrl;
  };

  const getVideoUrl = (videoPath: string) => {
    if (videoPath.startsWith('http')) {
      return videoPath;
    }
    const { data } = supabase.storage
      .from('product-videos')
      .getPublicUrl(videoPath);
    return data.publicUrl;
  };

  const getEmbeddableUrl = (url: string) => {
    if (url.includes('drive.google.com')) {
      const fileId = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId[1]}/preview`;
      }
    }
    return url;
  };

  const getDisplayImages = () => {
    if (!product) return [];
    
    const images = [];
    
    if (product.images && product.images.length > 0) {
      images.push(...product.images.map(img => getImageUrl(img)));
    }
    
    if (product.thumbnail_url && !images.some(img => img.includes(product.thumbnail_url))) {
      images.push(getImageUrl(product.thumbnail_url));
    }
    
    if (product.image_url && !images.some(img => img.includes(product.image_url!))) {
      images.push(getImageUrl(product.image_url));
    }
    
    return images.length > 0 ? images : ['/placeholder.svg'];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Product not found</p>
          <Button onClick={() => navigate('/video-feed')} className="mt-4">
            Back to Video Feed
          </Button>
        </div>
      </div>
    );
  }

  const isLiked = likedProducts.includes(product.id);
  const displayImages = getDisplayImages();
  const hasVideo = product.video_url && product.video_url.trim() !== '';
  const videoUrl = hasVideo ? getVideoUrl(product.video_url) : '';
  const embeddableUrl = hasVideo ? getEmbeddableUrl(videoUrl) : '';
  const isGoogleDrive = videoUrl.includes('drive.google.com');

  const currentIndex = productIds.indexOf(product.id);
  const hasNextProduct = currentIndex > -1 && currentIndex < productIds.length - 1;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-between items-center mb-4">
            <Button 
              onClick={() => navigate('/')} 
              variant="ghost" 
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            {hasNextProduct && (
              <Button onClick={handleNextListing} variant="outline">
                Next Listing
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                {hasVideo ? (
                  <div className="space-y-4">
                    {isGoogleDrive ? (
                      <iframe
                        src={embeddableUrl}
                        className="w-full h-64 md:h-96"
                        allow="autoplay"
                        title={product.title}
                      />
                    ) : (
                      <video
                        src={videoUrl}
                        poster={displayImages[0]}
                        className="w-full h-64 md:h-96 object-cover"
                        controls
                        autoPlay
                        loop
                        onError={(e) => {
                          console.error('Video failed to load:', product.video_url);
                        }}
                      />
                    )}
                    {displayImages.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 p-2">
                        {displayImages.slice(0, 9).map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Product image ${index + 1}`}
                            className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80"
                            onClick={() => openLightbox(index)}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <img
                      src={displayImages[currentImageIndex] || '/placeholder.svg'}
                      alt={product.title}
                      className="w-full h-64 md:h-96 object-cover cursor-pointer"
                      onClick={() => openLightbox(currentImageIndex)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder.svg';
                      }}
                    />
                    {displayImages.length > 1 && (
                      <div className="grid grid-cols-4 gap-2 p-2">
                        {displayImages.map((img, index) => (
                          <img
                            key={index}
                            src={img}
                            alt={`Product image ${index + 1}`}
                            className={`w-full h-16 object-cover rounded cursor-pointer ${
                              index === currentImageIndex ? 'ring-2 ring-blue-500' : 'hover:opacity-80'
                            }`}
                            onClick={() => setCurrentImageIndex(index)}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="md:w-1/2 p-6">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-2xl font-bold">{product.title}</h1>
                    <p className="text-3xl font-bold text-green-600 mt-2">
                      ${parseFloat(product.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <Badge variant="outline">Active</Badge>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Sold by</p>
                    <p className="font-medium">{product.seller_id.slice(0, 12)}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600">Description</p>
                    <p className="text-sm mt-1">{product.description}</p>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded mb-4">
                    <strong>How to Buy:</strong><br />
                    <span className="block mt-1">• <b>Add to Cart</b>: Use this if you want the item shipped to you. You'll pay securely online and the seller will ship it.</span>
                    <span className="block">• <b>Contact Seller</b>: Use this if you want to meet locally and pay in person.</span>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      onClick={() => addToCart(product)}
                      variant="outline" 
                      className="flex-1"
                    >
                      Add to Cart
                    </Button>
                  </div>

                  <Button 
                    onClick={() => setShowContactSeller(true)}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Seller
                  </Button>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => toggleLike(product.id)}
                      variant="outline" 
                      size="icon"
                      className={isLiked ? 'bg-red-50 border-red-200' : ''}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                    </Button>
                    <Button 
                      onClick={() => shareProduct(product)}
                      variant="outline" 
                      size="icon"
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isLightboxOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50"
          onClick={closeLightbox}
        >
          <div className="relative max-w-4xl max-h-4/5" onClick={(e) => e.stopPropagation()}>
              <img 
                  src={displayImages[currentImageIndex]} 
                  alt={product.title} 
                  className="max-h-[90vh] max-w-[90vw] object-contain"
              />
              <Button 
                  onClick={closeLightbox} 
                  variant="ghost"
                  className="absolute -top-12 right-0 text-white hover:text-white text-3xl font-bold"
              >
                  &times;
              </Button>
              {displayImages.length > 1 && (
                  <>
                      <Button
                          onClick={showPrevImage} 
                          variant="ghost"
                          className="absolute left-0 top-1/2 -translate-y-1/2 -ml-12 text-white hover:text-white text-3xl"
                      >
                          &#10094;
                      </Button>
                      <Button
                          onClick={showNextImage}
                          variant="ghost"
                          className="absolute right-0 top-1/2 -translate-y-1/2 -mr-12 text-white hover:text-white text-3xl"
                      >
                          &#10095;
                      </Button>
                  </>
              )}
          </div>
        </div>
      )}

      <ContactSellerModal
        isOpen={showContactSeller}
        onClose={() => setShowContactSeller(false)}
        sellerId={product.seller_id}
        productId={product.id}
        productTitle={product.title}
      />
    </>
  );
};

export default ProductDetail;