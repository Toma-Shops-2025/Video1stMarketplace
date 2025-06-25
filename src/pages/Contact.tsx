import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-xl text-gray-600 mb-8">Get in touch with our support team</p>
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-600 mb-4">Email: support@tomashops.com</p>
          <p className="text-gray-600 mb-4">Phone: 1-954-TOMASHOPS <small className="ml-2 text-xs text-gray-400">1-954-866-2746</small></p>
          <p className="text-gray-600">We're here to help 24/7!</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;