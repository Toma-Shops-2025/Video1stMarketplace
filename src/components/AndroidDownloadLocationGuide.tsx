import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Smartphone, FolderOpen, Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';

const AndroidDownloadLocationGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          Your downloaded project files are saved to your Android device. Here's exactly where to find them.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Where Your Files Are Saved
          </CardTitle>
          <CardDescription>
            When you download project files on Android, they go to these locations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Primary Download Location
            </h3>
            <code className="text-sm bg-white px-3 py-2 rounded border block">
              /storage/emulated/0/Download/
            </code>
            <p className="text-xs text-blue-700 mt-2">
              This is where most browsers save downloaded files
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">How to Find Your Files:</h4>
            
            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-medium text-sm">Method 1: File Manager</p>
              <p className="text-xs text-gray-600">Open your file manager app → Navigate to "Downloads" folder</p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="font-medium text-sm">Method 2: Browser Downloads</p>
              <p className="text-xs text-gray-600">Open Chrome/Browser → Menu → Downloads → Find your files</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="font-medium text-sm">Method 3: Search</p>
              <p className="text-xs text-gray-600">Use file manager search for "TomaShops" or "package.json"</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Can't Find Your Files?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-2">
            <p>• Check your browser's download history</p>
            <p>• Look in Documents folder: <code className="bg-gray-100 px-1 rounded">/storage/emulated/0/Documents/</code></p>
            <p>• Search for file extensions: .zip, .txt, .json</p>
            <p>• Check if files were saved to SD card instead</p>
          </div>
          
          <Alert>
            <AlertDescription className="text-xs">
              If you still can't find them, try downloading again and watch where your browser saves the file.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default AndroidDownloadLocationGuide;