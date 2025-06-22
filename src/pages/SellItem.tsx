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
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: 'new',
    location: null as { lat: number; lng: number; address: string } | null,
    allowShipping: true,
    localPickupOnly: false
  });

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setIsInitialCheckComplete(true);
      return;
    }

    const checkStripeOnboarding = async () => {
      const { data: account, error } = await supabase
        .from('seller_accounts')
        .select('payouts_enabled')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching seller account for Stripe check:', error);
        setIsStripeConnected(false);
      } else if (account && account.payouts_enabled) {
        setIsStripeConnected(true);
      } else {
        setIsStripeConnected(false);
        setTimeout(() => {
            setIsStripeModalOpen(true);
        }, 1500);
      }
      setIsInitialCheckComplete(true);
    };

    checkStripeOnboarding();
  }, [user, authLoading]);

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

    setLoading(true);
    try {
      const videoUrls = mediaUrls.filter(url => url.includes('product-videos'));
      const imageUrls = mediaUrls.filter(url => url.includes('product-images'));
      
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
        allow_shipping: formData.allowShipping,
        local_pickup_only: formData.localPickupOnly
      };

      try {
        const { error: insertError } = await supabase
          .from('products')
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
          allowShipping: true,
          localPickupOnly: false
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.slug} value={cat.slug}>
                              {cat.name}
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

                  {/* Shipping Options */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Switch id="allow-shipping" checked={formData.allowShipping} onCheckedChange={checked => setFormData({ ...formData, allowShipping: checked, localPickupOnly: !checked })} />
                      <Label htmlFor="allow-shipping">Allow Shipping</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="local-pickup" checked={formData.localPickupOnly} onCheckedChange={checked => setFormData({ ...formData, localPickupOnly: checked, allowShipping: !checked })} />
                      <Label htmlFor="local-pickup">Local Pickup Only</Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Submitting...' : 'Create Listing'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </AppLayout>

      {!user && <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />}
      <StripeOnboardingModal
        isOpen={isStripeModalOpen && isInitialCheckComplete && !isStripeConnected}
        isConnecting={isConnectingToStripe}
        onConfirm={proceedToStripeOnboarding}
        onClose={() => setIsStripeModalOpen(false)}
      />
    </>
  );
};

export default SellItem;