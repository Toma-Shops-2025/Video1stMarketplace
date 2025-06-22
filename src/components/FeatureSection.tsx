import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Shield, Truck, MessageCircle, Star, MapPin } from 'lucide-react';

const features = [
  {
    icon: Play,
    title: 'Video First',
    description: 'See items in action with video previews. No more guessing - see exactly what you\'re buying.',
    color: 'text-red-500'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Built-in safety features, verified sellers, and secure payment processing for peace of mind.',
    color: 'text-green-500'
  },
  {
    icon: Truck,
    title: 'Local & Shipped',
    description: 'Choose local pickup or secure shipping. We support both marketplace models.',
    color: 'text-blue-500'
  },
  {
    icon: MessageCircle,
    title: 'Direct Messaging',
    description: 'Chat directly with sellers and buyers. Negotiate prices and arrange meetups easily.',
    color: 'text-purple-500'
  },
  {
    icon: Star,
    title: 'Rated Community',
    description: 'Build trust with our rating system. See seller history and buyer feedback.',
    color: 'text-yellow-500'
  },
  {
    icon: MapPin,
    title: 'Location Based',
    description: 'Find deals near you with our advanced location-based search and map view.',
    color: 'text-indigo-500'
  }
];

const FeatureSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Why Choose TomaShops™?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of online marketplace with video-first listings, 
            enhanced security, and a community-driven approach.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
                <CardContent className="p-8 text-center">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`h-8 w-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Free to Use</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              <span>Mobile Friendly</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;