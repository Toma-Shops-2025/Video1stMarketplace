import React from 'react';

const FAQPage: React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">
          📚 TomaShops™ FAQ
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          Frequently Asked Questions
        </p>

        <div className="space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 What is TomaShops™?</h2>
            <p className="text-gray-700 leading-relaxed">
              TomaShops™ is a video-first online marketplace where sellers post short videos to showcase their products and buyers can shop directly through a TikTok-style feed or traditional product listings. It combines the visual appeal of video content with the functionality of an eCommerce platform—bringing a modern, immersive shopping experience to life.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 How does TomaShops™ work?</h2>
            <p className="text-gray-700 leading-relaxed">
              Sellers upload a product video, photos, title, description, price, and shipping/local delivery options.
            </p>
            <p className="text-gray-700 leading-relaxed mt-2">
              Buyers scroll through the video feed (just like TikTok or Reels), where they can tap:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 pl-4">
              <li>🛒 Add to Cart</li>
              <li>⚡ Buy Now</li>
              <li>💬 Message Seller</li>
              <li>❤️ Favorite</li>
              <li>🔗 Share</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-2">
              Buyers can checkout using Stripe's secure checkout system and opt for local pickup or shipped delivery.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Who can sell on TomaShops™?</h2>
            <p className="text-gray-700 leading-relaxed">
              Anyone with a product and a smartphone! Whether you're a casual seller or a growing business, you can register, upload your video listing, and start selling right away.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Are product videos required?</h2>
            <p className="text-gray-700 leading-relaxed">
              Yes. Every listing on TomaShops™ requires a short product video. Why? Because video shows the true look, feel, and function of an item—building more trust and making buying decisions easier.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Can I include photos too?</h2>
            <p className="text-gray-700 leading-relaxed">
             Absolutely. In addition to your required video, you can upload multiple product photos to give shoppers a complete view of your item.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 What types of products can I sell?</h2>
            <p className="text-gray-700 leading-relaxed">
              You can sell almost anything—as long as it's legal and complies with our terms. Popular categories include:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 pl-4">
              <li>Clothing & Accessories</li>
              <li>Tech & Electronics</li>
              <li>Vehicles</li>
              <li>Collectibles</li>
              <li>Handmade Goods</li>
              <li>Home Decor</li>
              <li>Tools & Hardware</li>
              <li>Toys & Games</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Is local buying available?</h2>
            <p className="text-gray-700 leading-relaxed">
              Yes. You can search by location, browse items near you, and arrange local pickups just like OfferUp or Facebook Marketplace.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Is shipping available?</h2>
            <p className="text-gray-700 leading-relaxed">
             Yes. Sellers can offer shipping within the U.S. or internationally, and buyers can select their preferred delivery option during checkout.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 How are payments handled?</h2>
            <p className="text-gray-700 leading-relaxed">
              All payments are processed securely through Stripe. Buyers can pay with debit/credit cards, Apple Pay, Google Pay, and more. Sellers receive payouts directly to their Stripe-connected bank accounts.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Is my information secure?</h2>
            <p className="text-gray-700 leading-relaxed">
             Yes. TomaShops™ uses SSL encryption, Stripe secure checkout, and follows industry-standard data privacy protocols to keep your personal and financial information protected.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 What if there's a problem with my order?</h2>
            <p className="text-gray-700 leading-relaxed">
              If there's a dispute (e.g., item not received, not as described), buyers can contact the seller through the in-app messaging feature. If no resolution is reached, our support team can step in to help resolve the issue.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 How do I contact customer support?</h2>
            <p className="text-gray-700 leading-relaxed">
             You can email us anytime at support@tomashops.com or call our 24/7 helpline at 1-800-TOMASHOPS.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 What is the fee for sellers?</h2>
            <p className="text-gray-700 leading-relaxed">
             TomaShops™ charges a small transaction fee (e.g., 5-10%) on each completed sale. There are no listing fees and no monthly subscriptions.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Can I favorite or bookmark items?</h2>
            <p className="text-gray-700 leading-relaxed">
             Yes! Tap the ❤️ icon to save items you like and find them later in your Favorites tab.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Can I message sellers before buying?</h2>
            <p className="text-gray-700 leading-relaxed">
             Definitely. Tap the Message Seller button on any listing to ask questions before purchasing. This promotes safe, informed buying.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 How does TomaShops™ ensure safe transactions?</h2>
             <ul className="list-disc list-inside text-gray-700 mt-2 pl-4">
                <li>Mandatory video listings</li>
                <li>In-app messaging</li>
                <li>Escrow-like protection with Stripe</li>
                <li>Buyer/seller rating and review system (coming soon!)</li>
                <li>Verified sellers (coming soon!)</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Can I search for specific items?</h2>
            <p className="text-gray-700 leading-relaxed">
             Yes. Use the search bar to find products by keyword or category. You can also filter by local vs. shipped, price, and more.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 What if I reach the end of the feed?</h2>
            <p className="text-gray-700 leading-relaxed">
             Don't worry—you won't. The video feed is endless and loops automatically, constantly updating with new listings.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 What's the difference between TomaShops™ and other marketplaces?</h2>
            <ul className="list-disc list-inside text-gray-700 mt-2 pl-4">
                <li>Video-first listings increase trust and clarity.</li>
                <li>Swipeable, social-style feed makes discovery fun and fast.</li>
                <li>Escrow-protected payments keep both parties safe.</li>
                <li>Modern, mobile-first experience built for 2025 and beyond.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Do I need a business license to sell?</h2>
            <p className="text-gray-700 leading-relaxed">
             Nope. You can be an individual, hobbyist, reseller, or business. Just follow the basic seller guidelines and tax laws in your area.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Can I use TomaShops™ internationally?</h2>
            <p className="text-gray-700 leading-relaxed">
             At the moment, TomaShops™ is primarily U.S.-based. International expansion is in the works, and global shipping will be rolled out in phases.
            </p>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 Can I promote my listings?</h2>
            <p className="text-gray-700 leading-relaxed">
             Yes! Promoted listings and seller ad tools are in development. For now, share your listing links on TikTok, Instagram, Facebook, and more to increase visibility.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🔹 How do I sign up?</h2>
            <ol className="list-decimal list-inside text-gray-700 mt-2 pl-4">
                <li>Visit www.TomaShops.com</li>
                <li>Create an account</li>
                <li>Upload your first video listing</li>
                <li>Start selling or shopping in minutes!</li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FAQPage; 