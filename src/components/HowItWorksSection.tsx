import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';

const HowItWorksSection = () => {
  const { user } = useAuth();

  const handleStartSelling = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please sign in to start selling.');
      return;
    }
    const { data } = await supabase
      .from('seller_accounts')
      .select('stripe_account_id')
      .eq('user_id', user.id)
      .single();
    if (!data || !data.stripe_account_id) {
      const res = await fetch('/.netlify/functions/stripe-onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const result = await res.json();
      if (result.accountLink) {
        window.location.href = result.accountLink;
      } else {
        alert(result.error || 'Failed to get Stripe onboarding link');
      }
      return;
    }
    // Already connected
    window.location.href = '/sell';
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How TomaShops Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Watch our demo video to see how easy it is to buy and sell on TomaShops using video listings.
          </p>
        </div>

        <div className="relative w-full max-w-4xl mx-auto mb-12" style={{ aspectRatio: '16/9' }}>
          <iframe
            src="https://video.pictory.ai/embed/1749642227566/202506111229148861HY0KIwPRd81taZ"
            title="TomaShops Video 1st Marketplace"
            className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">For Buyers</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">1.</span>
                <span>Browse video listings to see items in action</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">2.</span>
                <span>Contact sellers directly through our platform</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">3.</span>
                <span>Make secure payments through our system</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">4.</span>
                <span>Receive your items and leave feedback</span>
              </li>
            </ul>
            <Button asChild className="mt-6">
              <Link to="/">Start Shopping</Link>
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-4">For Sellers</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">1.</span>
                <span>Create an account and verify your identity</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">2.</span>
                <span>Record a video showcasing your item</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">3.</span>
                <span>Set your price and shipping options</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 font-bold mr-2">4.</span>
                <span>Manage orders and communicate with buyers</span>
              </li>
            </ul>
            <Button asChild className="mt-6">
              <a href="/sell" onClick={handleStartSelling}>Start Selling</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 