import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Settings, Package, Heart, LogOut, MessageCircle, ShoppingCart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import EditProfileModal from '@/components/EditProfileModal';
import MessagesModal from '@/components/MessagesModal';
import { toast } from '@/components/ui/use-toast';
import ProductGrid from '@/components/ProductGrid';
import { useAppContext } from '@/contexts/AppContext';
import supabase from '@/lib/supabase';
import StripeOnboardingModal from '@/components/StripeOnboardingModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Product } from '@/types'; // Assuming you have a types file

const Profile = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isConnectingToStripe, setIsConnectingToStripe] = useState(false);
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { likedProducts } = useAppContext();
  const [myListings, setMyListings] = useState([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number | null>(null);
  const [hasConversations, setHasConversations] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    console.log('Profile component - Auth state:', { user, loading });

    if (!loading && !user && mounted) {
      console.log('No user found, redirecting to home...');
      timeoutId = setTimeout(() => {
        if (mounted) {
          navigate('/', { replace: true });
        }
      }, 300);
    }

    return () => {
      mounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [loading, user, navigate]);

  useEffect(() => {
    const fetchMyListings = async () => {
      if (!user) return;
      setLoadingListings(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) setMyListings(data || []);
      setLoadingListings(false);
    };
    fetchMyListings();
  }, [user]);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user || !likedProducts.length) {
        setFavoriteProducts([]);
        return;
      }
      setLoadingFavorites(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', likedProducts);
      if (!error) setFavoriteProducts(data || []);
      setLoadingFavorites(false);
    };
    fetchFavorites();
  }, [user, likedProducts]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error) setOrders(data || []);
      setLoadingOrders(false);
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) {
        setUnreadCount(null);
        setHasConversations(false);
        return;
      }
      // Fetch unread messages
      const { data, error } = await supabase
        .from('messages')
        .select('id, sender_id, receiver_id, read')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`);
      if (error) {
        setUnreadCount(null);
        setHasConversations(false);
        return;
      }
      // Count unread messages for this user as receiver
      const unread = (data || []).filter(
        (msg) => msg.receiver_id === user.id && !msg.read
      ).length;
      setUnreadCount(unread);
      setHasConversations((data || []).length > 0);
    };
    fetchUnreadCount();
  }, [user]);

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }
      const { data, error } = await supabase
        .from('admins')
        .select('email')
        .eq('email', user.email)
        .single();
      setIsAdmin(!!data && !error);
    };
    checkAdmin();
  }, [user]);

  const handleEditProfile = () => {
    if (user) {
      setShowEditModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleCreateListing = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Check if user has a connected Stripe account
    const { data, error } = await supabase
      .from('seller_accounts')
      .select('stripe_account_id')
      .eq('user_id', user.id)
      .single();
    if (!data || !data.stripe_account_id) {
      // Not connected: prompt onboarding
      setIsStripeModalOpen(true);
      return;
    }
    // Connected: proceed to create listing
    navigate('/sell');
  };

  const handleViewMessages = () => {
    if (user) {
      setShowMessagesModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
    });
  };

  const handleStripeConnect = async () => {
    if (!user) return;
    setIsStripeModalOpen(true);
  };

  const proceedToStripeOnboarding = async () => {
    if (!user) return;
    setIsConnectingToStripe(true);
    try {
      const res = await fetch('/.netlify/functions/create-account-link', {
        method: 'POST',
        body: JSON.stringify({ userId: user.id, email: user.email }),
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      if (data.accountLink) {
        window.location.href = data.accountLink;
      } else {
        toast({ title: 'Error', description: data.error || 'Failed to get Stripe onboarding link', variant: 'destructive' });
        setIsConnectingToStripe(false);
        setIsStripeModalOpen(false);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not connect to Stripe.', variant: 'destructive' });
      setIsConnectingToStripe(false);
      setIsStripeModalOpen(false);
    }
  };

  const handleConfirmDelivery = async (order: any) => {
    if (!order.payment_intent_id || !order.seller_id) {
      toast({ title: 'Error', description: 'Cannot release funds: Missing payment or seller information.', variant: 'destructive' });
      return;
    }

    try {
      // Call backend to release funds
      const res = await fetch('/.netlify/functions/release-funds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentIntentId: order.payment_intent_id,
          sellerId: order.seller_id,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to release funds.');
      }
      
      // Update order status to 'released' in the database
      const { error: updateError } = await supabase
        .from('orders')
        .update({ status: 'released' })
        .eq('id', order.id);

      if (updateError) {
        console.error('Funds released but failed to update order status:', updateError);
        toast({ title: 'Funds Released!', description: 'Please refresh the page to see the updated status.' });
      } else {
        toast({ title: 'Success', description: 'Funds released to seller!' });
        // Refresh orders locally to update the UI instantly
        setOrders(orders => orders.map(o => o.id === order.id ? { ...o, status: 'released' } : o));
      }

    } catch (error: any) {
      console.error('Error releasing funds:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Redirect if no user
  if (!user) {
    return null; // Return null while the redirect happens
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        {!user && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome to TomaShops™!</h3>
                <p className="text-blue-700 mb-4">Sign in or create an account to access your profile and start selling.</p>
                <Button onClick={() => setShowAuthModal(true)} className="bg-blue-600 hover:bg-blue-700">
                  Sign In / Sign Up
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <p className="text-gray-900">
                    {user ? user.user_metadata?.full_name || 'Not provided' : 'Please sign in'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <p className="text-gray-900">{user ? user.email : 'Please sign in'}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1" onClick={handleEditProfile}>
                    <Settings className="w-4 h-4 mr-2" />
                    {user ? 'Edit Profile' : 'Sign In to Edit'}
                  </Button>
                  {user && (
                    <Button variant="outline" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  )}
                </div>
                {user && (
                  <button
                    onClick={handleStripeConnect}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                  >
                    Connect with Stripe
                  </button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Messages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  {user ?
                    (hasConversations
                      ? (unreadCount && unreadCount > 0
                          ? `${unreadCount} new message${unreadCount > 1 ? 's' : ''}`
                          : 'All messages read')
                      : 'No messages yet')
                    : 'Sign in to view messages'}
                </p>
                <Button onClick={handleViewMessages}>
                  {user ? 'View Messages' : 'Sign In to View'}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span>My Listings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingListings ? (
                <div className="text-center py-8">Loading...</div>
              ) : myListings.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No active listings</p>
                  <Button onClick={handleCreateListing}>Create Listing</Button>
                </div>
              ) : (
                <div className="py-2">
                  <ProductGrid products={myListings} hideFilters hidePagination isAdmin={isAdmin} userId={user.id} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Favorites</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingFavorites ? (
                <div className="text-center py-8">Loading...</div>
              ) : favoriteProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No favorites yet</p>
                </div>
              ) : (
                <div className="py-2">
                  <ProductGrid products={favoriteProducts} hideFilters hidePagination isAdmin={isAdmin} userId={user.id} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4">My Orders</h2>
          {loadingOrders ? (
            <div>Loading orders...</div>
          ) : orders.length === 0 ? (
            <div>No orders found.</div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <Card key={order.id}>
                  <CardContent className="py-4 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="font-medium">Order #{order.id}</div>
                      <div className="text-gray-600 text-sm">Status: {order.status}</div>
                      <div className="text-gray-600 text-sm">Total: ${order.total_amount}</div>
                    </div>
                    {order.status === 'pending_release' && (
                      <Button className="mt-2 md:mt-0" onClick={() => handleConfirmDelivery(order)}>
                        Confirm Delivery & Release Funds
                      </Button>
                    )}
                    {order.status === 'released' && (
                      <div className="text-green-600 font-semibold mt-2 md:mt-0">Funds Released</div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
      
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
      />

      <MessagesModal
        isOpen={showMessagesModal}
        onClose={() => setShowMessagesModal(false)}
      />
      <StripeOnboardingModal
        isOpen={isStripeModalOpen}
        onClose={() => setIsStripeModalOpen(false)}
        onConfirm={proceedToStripeOnboarding}
        loading={isConnectingToStripe}
      />
    </AppLayout>
  );
};

export default Profile;