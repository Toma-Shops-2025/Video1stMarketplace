import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/AuthModal';
import MediaUpload from '@/components/MediaUpload';
import StandardAd from '@/components/StandardAd';
import { useToast } from '@/components/ui/use-toast';
import { categories } from '@/components/CategorySection';
import LocationPicker from '@/components/LocationPicker';
import { Switch } from '@/components/ui/switch';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import StripeOnboardingModal from '@/components/StripeOnboardingModal';
import supabase from '@/lib/supabase';

const SellItem = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isConnectingToStripe, setIsConnectingToStripe] = useState(false);
  const [isInitialCheckComplete, setIsInitialCheckComplete] = useState(false);
  const [showStripeMessage, setShowStripeMessage] = useState(false);
  const [syncingStripe, setSyncingStripe] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'new',
    location: null as { lat: number; lng: number; address: string } | null,
    isShippable: true,
  });

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({ ...prev, location }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!formData.category) {
      toast({ 
        title: 'Category Required', 
        description: 'Please select a category for your item.',
        variant: 'destructive'
      });
      return;
    }

    if (!formData.location) {
      toast({
        title: 'Location Required',
        description: 'Please select your location on the map.',
        variant: 'destructive'
      });
      return;
    }

    if (formData.isShippable === null) {
      toast({
        title: 'Listing Type Required',
        description: 'Please select if your item is shippable or local pickup only.',
        variant: 'destructive',
      });
      return;
    }

    // If Allow Shipping is selected and seller is NOT Stripe onboarded, show Stripe modal and message
    if (!isStripeConnected) {
      setShowStripeMessage(true);
      setIsStripeModalOpen(true);
      return;
    }

    // If Allow Shipping is selected and seller IS Stripe onboarded, or if Local Pickup is selected, proceed as normal
    setLoading(true);
    try {
      const videoUrls = mediaUrls.filter(url => url.includes('listing-videos'));
      const imageUrls = mediaUrls.filter(url => url.includes('listing-images'));
      
      const selectedCategory = categories.find(cat => cat.slug === formData.category);
      
      // Validate the data before sending
      if (!formData.title || !formData.description || !formData.price || !formData.category) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields',
          variant: 'destructive'
        });
        return;
      }

      // Ensure price is a valid number
      if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
        toast({
          title: 'Invalid Price',
          description: 'Please enter a valid price greater than 0',
          variant: 'destructive'
        });
        return;
      }

      const productData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        condition: formData.condition,
        seller_id: user.id,
        status: 'active',
        images: imageUrls, // Send as array, Postgres will handle JSON conversion
        media_urls: mediaUrls, // Send as array, Postgres will handle JSON conversion
        video_url: videoUrls.length > 0 ? videoUrls[0] : null,
        image_url: imageUrls.length > 0 ? imageUrls[0] : null,
        thumbnail_url: imageUrls.length > 0 ? imageUrls[0] : null,
        category_slug: formData.category,
        location_lat: formData.location.lat,
        location_lng: formData.location.lng,
        location_address: formData.location.address,
        is_shippable: formData.isShippable,
      };

      try {
        const { error: insertError } = await supabase
          .from('listings')
          .insert([productData]);

        if (insertError) {
          console.error('Supabase insert error:', insertError);
          toast({
            title: 'Error',
            description: insertError.message || 'Failed to create listing',
            variant: 'destructive'
          });
          return;
        }

        toast({ 
          title: 'Success', 
          description: 'Product listed successfully!' 
        });
        
        // Reset form
        setFormData({ 
          title: '', 
          description: '', 
          price: '', 
          category: '', 
          condition: 'new',
          location: null,
          isShippable: true,
        });
        setMediaUrls([]);
      } catch (error) {
        console.error('Error creating listing:', error);
        toast({
          title: 'Error',
          description: 'Failed to create listing',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      toast({ title: 'Error', description: 'Failed to create listing', variant: 'destructive' });
    }
  };

  const proceedToStripeOnboarding = async () => {
    if (!user) return;
    setIsConnectingToStripe(true);
    try {
      const res = await fetch('/.netlify/functions/create-account-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const result = await res.json();
      if (result.accountLink) {
        window.location.href = result.accountLink;
      } else {
        toast({
          title: 'Error',
          description: result.error || 'Failed to get Stripe onboarding link',
          variant: 'destructive',
        });
        setIsConnectingToStripe(false);
        setIsStripeModalOpen(false);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Could not connect to Stripe.', variant: 'destructive' });
      setIsConnectingToStripe(false);
      setIsStripeModalOpen(false);
    }
  };

  // Poll for payouts_enabled after returning from Stripe onboarding
  useEffect(() => {
    if (!user) return;
    // Check if we just returned from Stripe (look for /sell in location or a query param)
    const urlParams = new URLSearchParams(window.location.search);
    const fromStripe = urlParams.get('fromStripe');
    if (fromStripe === '1' || document.referrer.includes('stripe.com')) {
      setSyncingStripe(true);
      let attempts = 0;
      const maxAttempts = 10;
      const interval = setInterval(async () => {
        const { data } = await supabase
          .from('seller_accounts')
          .select('stripe_account_id, payouts_enabled')
          .eq('user_id', user.id)
          .single();
        if (data && data.stripe_account_id && data.payouts_enabled) {
          setIsStripeConnected(true);
          setSyncingStripe(false);
          clearInterval(interval);
        } else if (attempts >= maxAttempts) {
          setSyncingStripe(false);
          clearInterval(interval);
        }
        attempts++;
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [user]);

  // On mount, check if user is already Stripe connected
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('seller_accounts')
        .select('stripe_account_id, payouts_enabled')
        .eq('user_id', user.id)
        .single();
      setIsStripeConnected(!!(data && data.stripe_account_id && data.payouts_enabled));
    })();
  }, [user]);

  if (authLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">Finalizing account setup, please wait...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <>
      <AppLayout>
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Link to="/">
              <Button variant="ghost" className="mb-4 -ml-2 text-muted-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Listings
              </Button>
            </Link>
            <Card>
              <CardHeader>
                <CardTitle>Create a New Listing</CardTitle>
              </CardHeader>
              <CardContent>
                {syncingStripe ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-700">Syncing your Stripe account... Please wait a moment.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Input */}
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" placeholder="e.g., Brand New Gaming Laptop" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea id="description" placeholder="Describe your item in detail" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                    </div>
                    
                    {/* Media Uploader */}
                    <div className="space-y-2">
                      <Label>Media (Videos & Images)</Label>
                      <MediaUpload onUpload={urls => setMediaUrls(urls)} />
                    </div>

                    {/* Price and Category Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input id="price" type="number" placeholder="e.g., 99.99" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={value => setFormData({ ...formData, category: value })}>
                          <SelectTrigger className="w-full min-w-[200px]">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent className="max-h-60 overflow-y-auto">
                            {categories.map((cat) => (
                              <SelectItem key={cat.slug} value={cat.slug} className="whitespace-normal break-words">
                                {cat.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Condition Input */}
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select value={formData.condition} onValueChange={value => setFormData({ ...formData, condition: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="used-like-new">Used (like new)</SelectItem>
                          <SelectItem value="used-good">Used (good)</SelectItem>
                          <SelectItem value="used-fair">Used (fair)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Location Picker */}
                    <div className="space-y-2">
                      <Label>Location</Label>
                      <LocationPicker onLocationSelect={handleLocationSelect} />
                    </div>

                    {/* Listing Type */}
                    <div className="flex items-center gap-4 mt-8">
                      <Switch
                        id="local-pickup-switch"
                        checked={formData.isShippable === false}
                        onCheckedChange={checked => setFormData({ ...formData, isShippable: !checked })}
                      />
                      <Label htmlFor="local-pickup-switch" className="mb-0">Local Pickup Only</Label>
                    </div>
                    <div style={{ fontSize: '0.9em', color: '#888', marginTop: 8, marginBottom: 8 }}>
                      {formData.isShippable === false
                        ? 'Buyers will pay you in person and pick up the item locally.'
                        : 'Buyers will pay online and you must ship the item.'}
                    </div>

                    {/* Submit Button */}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Submitting...' : 'Create Listing'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>

      {!user && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
      <StripeOnboardingModal
        isOpen={isStripeModalOpen && !isStripeConnected}
        onConfirm={proceedToStripeOnboarding}
        onClose={() => setIsStripeModalOpen(false)}
        loading={isConnectingToStripe}
        message="To offer shipping, you must connect your Stripe account. You'll be redirected to Stripe to set up payouts for shipped items. Once completed, you'll return here to finish your listing."
      />
    </>
  );
};

export default SellItem;