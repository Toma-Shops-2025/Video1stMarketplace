import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SafetyGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Safety Guide</h1>
          <p className="text-xl text-gray-600">Your safety is our top priority</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 mb-12">
          <Card>
            <CardHeader>
              <Shield className="w-12 h-12 text-green-600 mb-4" />
              <CardTitle>Secure Transactions</CardTitle>
              <CardDescription>All payments are protected</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">We use industry-standard encryption to protect your financial information.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="w-12 h-12 text-blue-600 mb-4" />
              <CardTitle>Verified Sellers</CardTitle>
              <CardDescription>All sellers go through verification</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Our verification process ensures legitimate sellers and quality products.</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <AlertTriangle className="w-8 h-8 text-orange-600 mb-2" />
            <CardTitle>Safety Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-600">
              <li>• Always use our secure payment system</li>
              <li>• Report suspicious activity immediately</li>
              <li>• Read seller reviews before purchasing</li>
              <li>• Keep communication within the platform</li>
            </ul>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link to="/contact">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Report an Issue
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SafetyGuide;