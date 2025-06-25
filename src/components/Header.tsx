import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from './AuthModal';
import Logo from './Logo';
import { ShoppingCart, Menu } from 'lucide-react';
import supabase from '@/lib/supabase';
import { toast } from './ui/use-toast';
import { useTheme } from 'next-themes';

const Header: React.FC = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSellHeaderClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    setNavOpen(false);
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to start selling.',
        variant: 'destructive',
      });
      return;
    }
    navigate('/sell');
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between">
        <div className="flex items-center">
          {/* Hamburger menu */}
          <button
            className="p-2 mr-2 focus:outline-none"
            onClick={() => setNavOpen((open) => !open)}
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          {/* Dropdown menu */}
          {navOpen && (
            <div className="absolute top-14 left-2 bg-white shadow-lg rounded-lg py-2 px-4 z-50 min-w-[180px]">
              <a href="/sell" className="block py-2 hover:text-blue-600" onClick={handleSellHeaderClick}>Sell Items</a>
              <Link to="/feed" className="block py-2 hover:text-blue-600" onClick={() => setNavOpen(false)}>Video Feed</Link>
              <Link to="/" className="block py-2 hover:text-blue-600" onClick={() => setNavOpen(false)}>Home</Link>
              <Link to="/contact" className="block py-2 hover:text-blue-600" onClick={() => setNavOpen(false)}>Contact Us</Link>
            </div>
          )}
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Logo />
          </Link>
        </div>
        <div className="flex items-center space-x-2 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            asChild
          >
            <Link to="/cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.user_metadata?.avatar_url}
                      alt={user.user_metadata?.full_name || 'User'}
                    />
                    <AvatarFallback>
                      {(user.user_metadata?.full_name?.[0] || 'U').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              onClick={() => setIsAuthModalOpen(true)}
              disabled={authLoading}
            >
              Sign In
            </Button>
          )}
        </div>
      </header>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;