import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import Logo from './Logo';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address.',
        variant: 'destructive'
      });
      return;
    }
    
    // Simulate subscription success
    toast({
      title: 'Subscribed!',
      description: 'Thank you for subscribing to our newsletter.'
    });
    setEmail('');
    
    // Navigate to contact page after subscription
    navigate('/contact');
  };

  return (
    <footer className="bg-[#1B2419] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <Logo size="sm" color="white" />
            </div>
            <p className="text-gray-400 text-sm mt-4">
              The future of online marketplace where videos showcase products better than photos ever could.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost" className="text-gray-500 hover:text-white p-0">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-500 hover:text-white p-0">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-500 hover:text-white p-0">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button size="sm" variant="ghost" className="text-gray-500 hover:text-white p-0">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/faq" className="text-gray-300 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/safety" className="text-gray-300 hover:text-white transition-colors">Safety Guide</Link></li>
              <li><Link to="/shipping" className="text-gray-300 hover:text-white transition-colors">Shipping & Handling</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Stay Updated</h4>
            <p className="text-sm text-gray-300">
              Get the latest deals and new listings delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Subscribe
              </Button>
            </form>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>support@tomashops.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>1-954-TOMASHOPS</span>
                <small className="ml-2 text-xs text-gray-400">1-954-866-2746</small>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 TomaShops™ Video 1st Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;