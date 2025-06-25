import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, Shield, Package } from 'lucide-react';

const Shipping: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shipping & Handling</h1>
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="w-6 h-6 mr-2 text-blue-600" />
              Shipping Options
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Standard Shipping</h3>
                <p className="text-gray-700 mb-2">5-7 business days</p>
                <p className="text-green-600 font-semibold">FREE on orders over $50</p>
                <p className="text-gray-600">$5.99 for orders under $50</p>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">Express Shipping</h3>
                <p className="text-gray-700 mb-2">2-3 business days</p>
                <p className="text-blue-600 font-semibold">$12.99</p>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-blue-600" />
              Processing Time
            </h2>
            <p className="text-gray-700 mb-4">Orders are typically processed within 1-2 business days. Processing time may be longer during peak seasons or for custom items.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>In-stock items: 1-2 business days</li>
              <li>Custom/made-to-order items: 3-5 business days</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-6 h-6 mr-2 text-blue-600" />
              Packaging
            </h2>
            <p className="text-gray-700">All items are carefully packaged to ensure they arrive in perfect condition. We use eco-friendly packaging materials whenever possible.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Shield className="w-6 h-6 mr-2 text-blue-600" />
              Tracking & Insurance
            </h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>All shipments include tracking information</li>
              <li>You'll receive tracking details via email once your order ships</li>
              <li>Orders over $100 are automatically insured</li>
              <li>Insurance can be added to any order for $2.99</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Shipping</h2>
            <p className="text-gray-700 mb-4">We currently ship to the following countries:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
              <li>United States (domestic)</li>
              <li>Canada</li>
              <li>United Kingdom</li>
              <li>European Union countries</li>
            </ul>
            <p className="text-gray-700 mt-4">International shipping rates and delivery times vary by destination. Customers are responsible for any customs duties or taxes.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">For shipping questions or concerns, please contact us at shipping@tomashops.com or call 1-954-TOMASHOPS <small className="ml-2 text-xs text-gray-400">1-954-866-2746</small>.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;