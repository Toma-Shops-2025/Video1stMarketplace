import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, ExternalLink, Smartphone, Upload, Globe } from 'lucide-react';

const QuickStartGuide: React.FC = () => {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const toggleStep = (stepIndex: number) => {
    setCompletedSteps(prev => 
      prev.includes(stepIndex) 
        ? prev.filter(i => i !== stepIndex)
        : [...prev, stepIndex]
    );
  };

  const steps = [
    {
      title: "Find Your Project Files",
      description: "Locate your TomaShops project folder on your Android device",
      icon: <Smartphone className="w-5 h-5" />,
      action: "Use the 'Find Project' tab above"
    },
    {
      title: "Open GitHub Repository",
      description: "Go to your GitHub repository in a web browser",
      icon: <ExternalLink className="w-5 h-5" />,
      action: "Visit github.com/toma-shops/TomaShops-FamousAI",
      link: "https://github.com/toma-shops/TomaShops-FamousAI"
    },
    {
      title: "Upload Project Files",
      description: "Upload your project files to the GitHub repository",
      icon: <Upload className="w-5 h-5" />,
      action: "Click 'Add file' > 'Upload files' on GitHub"
    },
    {
      title: "Deploy Automatically",
      description: "Your site will automatically deploy once files are uploaded",
      icon: <Globe className="w-5 h-5" />,
      action: "Wait 2-5 minutes for deployment to complete"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Start: Android to GitHub</CardTitle>
        <CardDescription>
          Follow these steps to get your project online in minutes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index);
          return (
            <div
              key={index}
              className={`border rounded-lg p-4 transition-colors ${
                isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100'
                }`}>
                  {isCompleted ? <CheckCircle className="w-5 h-5" /> : step.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  <p className="text-xs text-blue-600 mt-2">{step.action}</p>
                  
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant={isCompleted ? "outline" : "default"}
                      onClick={() => toggleStep(index)}
                    >
                      {isCompleted ? 'Completed ✓' : 'Mark Complete'}
                    </Button>
                    {step.link && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(step.link, '_blank')}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Open
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {completedSteps.length === steps.length && (
          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              🎉 Congratulations! Your TomaShops project should now be live online!
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickStartGuide;