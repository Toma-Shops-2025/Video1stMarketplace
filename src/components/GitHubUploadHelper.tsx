import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Github, Upload, CheckCircle, ExternalLink } from 'lucide-react';

const GitHubUploadHelper: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const steps = [
    {
      title: "Open GitHub in Browser",
      description: "Go to github.com/toma-shops/TomaShops-FamousAI",
      action: () => window.open('https://github.com/toma-shops/TomaShops-FamousAI', '_blank')
    },
    {
      title: "Sign In to GitHub",
      description: "Make sure you're logged into your GitHub account"
    },
    {
      title: "Upload Files",
      description: "Click 'Add file' > 'Upload files' or drag and drop"
    },
    {
      title: "Select Your Project Files",
      description: "Choose all files from your TomaShops project folder"
    },
    {
      title: "Commit Changes",
      description: "Add a commit message and click 'Commit changes'"
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            Upload to GitHub Repository
          </CardTitle>
          <CardDescription>
            Step-by-step guide to upload your project to GitHub
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isComplete ? (
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    index === currentStep ? 'border-blue-500 bg-blue-50' : 
                    index < currentStep ? 'border-green-500 bg-green-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      index < currentStep ? 'bg-green-500 text-white' :
                      index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}>
                      {index < currentStep ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                      
                      {index === currentStep && (
                        <div className="mt-3 space-y-2">
                          {step.action && (
                            <Button 
                              onClick={step.action}
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="w-4 h-4" />
                              Open GitHub
                            </Button>
                          )}
                          <Button 
                            onClick={() => {
                              if (index === steps.length - 1) {
                                setIsComplete(true);
                              } else {
                                setCurrentStep(index + 1);
                              }
                            }}
                            variant={step.action ? "outline" : "default"}
                            className="w-full"
                          >
                            {index === steps.length - 1 ? 'Complete!' : 'Next Step'}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                Congratulations! Your project should now be uploaded to GitHub. 
                It will automatically deploy to your live website.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GitHubUploadHelper;