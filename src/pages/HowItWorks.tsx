import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">&larr; Back to Home</Link>
      <h1 className="text-3xl font-bold mb-8 text-center">How TomaShops Works</h1>
      <div className="max-w-3xl mx-auto">
        <div className="aspect-w-16 aspect-h-9 mb-8">
          <iframe
            src="https://video.pictory.ai/embed/1749642227566/202506111229148861HY0KIwPRd81taZ"
            title="TomaShops Video 1st Marketplace"
            className="w-full h-full rounded-lg shadow-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            TomaShops is your go-to marketplace for buying and selling items through video. Here's how it works:
          </p>
          <ol className="list-decimal pl-6 space-y-4">
            <li>Create an account or sign in to get started</li>
            <li>Browse video listings or create your own to sell items</li>
            <li>Connect with buyers/sellers through our secure messaging system</li>
            <li>Complete transactions safely using our secure payment system</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;