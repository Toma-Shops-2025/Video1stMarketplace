import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { Link, useLocation } from 'react-router-dom';
import { X, Home, ShoppingCart, User, Play, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from './Header';
import Footer from './Footer';
import HowItWorksSection from './HowItWorksSection';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import MessagesModal from './MessagesModal';
import { MessageSquare } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import supabase from '@/lib/supabase';

interface AppLayoutProps {
  children?: React.ReactNode;
  showHero?: boolean;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, showHero = false }) => {
  const { sidebarOpen, toggleSidebar } = useAppContext();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, signOut } = useAuth();
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (user && !user.email_confirmed_at && !user.confirmed_at) {
      setShowConfirmModal(true);
      signOut();
    }
  }, [user, signOut]);

  const handleMenuClick = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      toggleSidebar();
    }
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleSellMenuClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    closeMobileMenu();
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
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="sm" onClick={closeMobileMenu}>
                <X className="w-5 h-5" />
              </Button>
            </div>
            <nav className="p-4 space-y-2">
              <Link to="/" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <Home className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link to="/sell" onClick={handleSellMenuClick} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <Plus className="w-5 h-5" />
                <span>Sell Item</span>
              </Link>
              <Link to="/categories" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <Search className="w-5 h-5" />
                <span>Browse Products</span>
              </Link>
              <Link to="/feed" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <Play className="w-5 h-5" />
                <span>Video Feed</span>
              </Link>
              <Link to="/cart" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <ShoppingCart className="w-5 h-5" />
                <span>Cart</span>
              </Link>
              <Link to="/profile" onClick={closeMobileMenu} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100">
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Link>
            </nav>
          </div>
        </div>
      )}
      
      <main className="min-h-screen">
        {children}
      </main>
      
      {isHomePage && <HowItWorksSection />}
      <Footer />
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <h2 className="text-xl font-bold mb-4">Please Confirm Your Email</h2>
            <p className="mb-4">You must confirm your email address before you can use your account. Please check your inbox for a confirmation link.</p>
            <Button onClick={() => setShowConfirmModal(false)}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppLayout;
export { AppLayout };