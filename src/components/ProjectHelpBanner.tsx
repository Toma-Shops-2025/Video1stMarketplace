import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { HelpCircle, X } from 'lucide-react';
import { useState } from 'react';

const ProjectHelpBanner: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert className="bg-blue-50 border-blue-200 mb-6">
      <HelpCircle className="w-4 h-4 text-blue-600" />
      <AlertDescription className="flex items-center justify-between w-full">
        <div className="flex-1">
          <span className="text-blue-800">
            <strong>Need help getting your project online?</strong> We'll help you find where your TomaShops™ project is stored and deploy it to the web.
          </span>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Button
            size="sm"
            onClick={() => navigate('/project-help')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Get Help
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsVisible(false)}
            className="text-blue-600 hover:bg-blue-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ProjectHelpBanner;