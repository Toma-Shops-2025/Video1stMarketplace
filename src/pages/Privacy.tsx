import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="bg-white p-8 rounded-lg shadow space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
            <p className="text-gray-700 mb-4">We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Personal information (name, email, phone number)</li>
              <li>Payment information (processed securely through third-party providers)</li>
              <li>Usage data and preferences</li>
            </ul>
          </div>
          
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>Process transactions and fulfill orders</li>
              <li>Provide customer support</li>
              <li>Send important updates about your account</li>
              <li>Improve our services and user experience</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
            <p className="text-gray-700">We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-4">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
            <p className="text-gray-700">We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700">If you have questions about this Privacy Policy, please contact us at privacy@tomashops.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;