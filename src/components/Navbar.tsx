import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                src="/logo.png"
                alt="TomaShops Video 1st Marketplace"
                className="h-8 w-auto"
              />
            </Link>
          </div>
          {/* ... rest of the navbar code ... */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 