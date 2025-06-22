import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';
import { Product, CartItem, Order, Like, Message } from '@/types';

interface AppContextType {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  cartItems: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateCartItemQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  likedProducts: string[];
  toggleLike: (productId: string) => void;
  shareProduct: (product: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`cart_${user.id}`);
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart));
        } catch (error) {
          console.error('Error loading cart from localStorage:', error);
          setCartItems([]);
        }
      }
      
      const savedLikes = localStorage.getItem(`likes_${user.id}`);
      if (savedLikes) {
        try {
          setLikedProducts(JSON.parse(savedLikes));
        } catch (error) {
          console.error('Error loading likes from localStorage:', error);
          setLikedProducts([]);
        }
      }
    } else {
      setCartItems([]);
      setLikedProducts([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && cartItems.length >= 0) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  useEffect(() => {
    if (user && likedProducts.length >= 0) {
      localStorage.setItem(`likes_${user.id}`, JSON.stringify(likedProducts));
    }
  }, [likedProducts, user]);

  useEffect(() => {
    if (!user) {
      setCartItems([]);
      return;
    }
    // Fetch cart items from Supabase on login
    const fetchCart = async () => {
      try {
        const { data, error } = await supabase
          .from('cart_items')
          .select('id, productId:product_id, title, price, quantity, image')
          .eq('user_id', user.id);
        if (error) {
          console.error('Error fetching cart items from Supabase:', error);
          setCartItems([]);
        } else {
          setCartItems(data);
        }
      } catch (err) {
        console.error('Unexpected error fetching cart items:', err);
        setCartItems([]);
      }
    };
    fetchCart();
  }, [user]);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const addToCart = async (product: any) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to add items to cart', variant: 'destructive' });
      return;
    }
    try {
      console.log('Adding to cart:', { userId: user.id, productId: product.id, product });
      // Check if item already exists in cart
      const { data: existing, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single();
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error checking existing cart item:', fetchError);
        throw fetchError;
      }
      if (existing) {
        // Update quantity
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + 1 })
          .eq('id', existing.id);
        if (updateError) {
          console.error('Error updating cart item quantity:', updateError);
          throw updateError;
        }
        setCartItems(prev => prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      } else {
        // Insert new cart item
        const { data, error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id,
            title: product.title,
            price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
            quantity: 1,
            image: product.thumbnail_url || product.image_url || product.image || '/placeholder.svg'
          })
          .select()
          .single();
        if (insertError) {
          console.error('Error inserting new cart item:', insertError);
          throw insertError;
        }
        setCartItems(prev => [...prev, { ...data, productId: data.product_id }]);
      }
      // Refetch cart after add
      try {
        const { data: refreshed, error: refreshError } = await supabase
          .from('cart_items')
          .select('id, productId:product_id, title, price, quantity, image')
          .eq('user_id', user.id);
        if (refreshError) {
          console.error('Error refreshing cart after add:', refreshError);
        } else {
          setCartItems(refreshed);
        }
      } catch (refreshErr) {
        console.error('Unexpected error refreshing cart after add:', refreshErr);
      }
      toast({ title: 'Added to cart', description: `${product.title} added to cart` });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({ title: 'Error', description: 'Failed to add item to cart', variant: 'destructive' });
    }
  };

  const removeFromCart = async (id: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setCartItems(cartItems.filter(item => item.id !== id && item.productId !== id));
      toast({ title: 'Removed from cart', description: 'Item removed from cart' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to remove item from cart', variant: 'destructive' });
    }
  };

  const updateCartItemQuantity = async (id: string, quantity: number) => {
    if (!user) return;
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setCartItems(cartItems.map(item => (item.id === id || item.productId === id) ? { ...item, quantity } : item));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to update quantity', variant: 'destructive' });
    }
  };

  const clearCart = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);
      if (error) throw error;
      setCartItems([]);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to clear cart', variant: 'destructive' });
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const toggleLike = (productId: string) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to like products', variant: 'destructive' });
      return;
    }

    const isLiked = likedProducts.includes(productId);
    try {
      if (isLiked) {
        console.log('Removing from favorites:', productId);
        setLikedProducts(prev => prev.filter(id => id !== productId));
      } else {
        console.log('Adding to favorites:', productId);
        setLikedProducts(prev => [...prev, productId]);
      }
      toast({ 
        title: isLiked ? 'Removed from favorites' : 'Added to favorites'
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({ title: 'Error', description: 'Failed to update favorites', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (user) {
      try {
        const savedLikes = localStorage.getItem(`likes_${user.id}`);
        if (savedLikes) {
          setLikedProducts(JSON.parse(savedLikes));
        }
      } catch (error) {
        console.error('Error loading likes from localStorage:', error);
        setLikedProducts([]);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user && likedProducts.length >= 0) {
      try {
        localStorage.setItem(`likes_${user.id}`, JSON.stringify(likedProducts));
        console.log('Favorites updated in localStorage:', likedProducts);
      } catch (error) {
        console.error('Error saving likes to localStorage:', error);
      }
    }
  }, [likedProducts, user]);

  useEffect(() => {
    if (user) {
      console.log('Current favorites:', likedProducts);
    }
  }, [likedProducts, user]);

  const shareProduct = (product: any) => {
    try {
      const productUrl = `${window.location.origin}/product/${product.id}`;
      
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(productUrl).then(() => {
          toast({ title: 'Link copied to clipboard', description: 'Share this product with others!' });
        }).catch(() => {
          toast({ title: 'Share failed', description: 'Unable to copy link', variant: 'destructive' });
        });
      } else {
        toast({ title: 'Share not supported', description: 'Your browser does not support sharing' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to share product', variant: 'destructive' });
    }
  };

  return (
    <AppContext.Provider
      value={{
        sidebarOpen,
        toggleSidebar,
        cartItems,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotal,
        likedProducts,
        toggleLike,
        shareProduct,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};