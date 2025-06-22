import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Folder, Copy, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

const AndroidFilePathGuide: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const commonPaths = [
    {
      name: "Internal Storage",
      path: "/storage/emulated/0/",
      description: "Main storage area, check Documents, Downloads, or root"
    },
    {
      name: "Downloads Folder",
      path: "/storage/emulated/0/Download/",
      description: "If you downloaded your project files"
    },
    {
      name: "Documents Folder",
      path: "/storage/emulated/0/Documents/",
      description: "Common location for project files"
    },
    {
      name: "Termux Home",
      path: "/data/data/com.termux/files/home/",
      description: "If you used Termux for development"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Folder className="w-5 h-5" />
          Common Android File Locations
        </CardTitle>
        <CardDescription>
          These are the most common places where your project might be stored
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <CheckCircle className="w-4 h-4" />
          <AlertDescription>
            Use your file manager's search function to look for "TomaShops", "React", or "package.json"
          </AlertDescription>
        </Alert>
        
        <div className="space-y-3">
          {commonPaths.map((location, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">{location.name}</h3>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 block">
                    {location.path}
                  </code>
                  <p className="text-xs text-gray-600 mt-2">{location.description}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(location.path)}
                  className="ml-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-sm mb-2">Quick Tips:</h4>
          <ul className="text-xs space-y-1 text-blue-800">
            <li>• Look for folders containing "package.json" or "src" folder</li>
            <li>• Search for "node_modules" (but don't upload this folder)</li>
            <li>• Check your recent downloads if you downloaded the project</li>
            <li>• Use file manager's "Recent" or "Search" feature</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default AndroidFilePathGuide;