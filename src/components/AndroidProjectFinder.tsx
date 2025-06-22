import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Smartphone, Folder, Download, Upload, Github } from 'lucide-react';

const AndroidProjectFinder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [foundLocation, setFoundLocation] = useState<string | null>(null);

  const commonLocations = [
    {
      path: '/storage/emulated/0/Documents/TomaShops',
      description: 'Documents folder'
    },
    {
      path: '/storage/emulated/0/Download/TomaShops',
      description: 'Downloads folder'
    },
    {
      path: '/storage/emulated/0/Android/data/com.termux/files/home/TomaShops',
      description: 'Termux home directory'
    },
    {
      path: '/sdcard/TomaShops',
      description: 'SD Card root'
    }
  ];

  const steps = [
    {
      title: "Open Your File Manager",
      description: "Look for 'Files', 'My Files', or 'File Manager' app on your Android",
      icon: <Folder className="w-6 h-6" />
    },
    {
      title: "Search for Your Project",
      description: "Look in these common locations for your TomaShops project folder",
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      title: "Upload to GitHub",
      description: "Once found, we'll help you upload it to GitHub",
      icon: <Github className="w-6 h-6" />
    }
  ];

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            Find Your Project on Android
          </CardTitle>
          <CardDescription>
            Let's locate your TomaShops project files on your Android device
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 0 && (
            <div className="space-y-4">
              <Alert>
                <Folder className="w-4 h-4" />
                <AlertDescription>
                  First, open your Android file manager app. This might be called "Files", "My Files", or "File Manager".
                </AlertDescription>
              </Alert>
              <Button onClick={() => setCurrentStep(1)} className="w-full">
                I opened my file manager
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Check these common locations:</h3>
              <div className="space-y-2">
                {commonLocations.map((location, index) => (
                  <div key={index} className="border rounded p-3">
                    <div className="font-mono text-sm bg-gray-100 p-2 rounded mb-2">
                      {location.path}
                    </div>
                    <p className="text-sm text-gray-600">{location.description}</p>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setFoundLocation(location.path);
                        setCurrentStep(2);
                      }}
                      className="mt-2"
                    >
                      Found it here!
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" onClick={() => setCurrentStep(0)} className="w-full">
                Go back
              </Button>
            </div>
          )}

          {currentStep === 2 && foundLocation && (
            <div className="space-y-4">
              <Alert>
                <Github className="w-4 h-4" />
                <AlertDescription>
                  Great! Found your project at: {foundLocation}
                </AlertDescription>
              </Alert>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Now upload to GitHub:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Open GitHub.com in your browser</li>
                  <li>Sign in to your account</li>
                  <li>Go to: github.com/toma-shops/TomaShops-FamousAI</li>
                  <li>Click "uploading an existing file" or "+" button</li>
                  <li>Select all files from: {foundLocation}</li>
                  <li>Add commit message: "Initial upload"</li>
                  <li>Click "Commit changes"</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AndroidProjectFinder;