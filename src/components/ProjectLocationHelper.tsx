import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FolderOpen, Search, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const ProjectLocationHelper = () => {
  const [checkedLocation, setCheckedLocation] = useState<string>('');
  const [foundFiles, setFoundFiles] = useState<boolean | null>(null);

  const commonLocations = [
    {
      id: 'downloads',
      name: 'Downloads Folder',
      path: 'C:\\Users\\[Username]\\Downloads',
      description: 'Most common download location'
    },
    {
      id: 'desktop',
      name: 'Desktop',
      path: 'C:\\Users\\[Username]\\Desktop',
      description: 'Files saved to desktop'
    },
    {
      id: 'documents',
      name: 'Documents',
      path: 'C:\\Users\\[Username]\\Documents',
      description: 'Default save location for many apps'
    },
    {
      id: 'projects',
      name: 'Projects Folder',
      path: 'C:\\Users\\[Username]\\Projects',
      description: 'Custom project directory'
    }
  ];

  const checkLocation = (locationId: string) => {
    setCheckedLocation(locationId);
    // Simulate checking - in real app this would check actual file system
    setTimeout(() => {
      setFoundFiles(Math.random() > 0.5);
    }, 1000);
  };

  const openFileExplorer = (path: string) => {
    // This would open file explorer in a real desktop app
    alert(`Opening: ${path}\n\nIn a real app, this would open File Explorer to this location.`);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Project files not showing up? Let's check common locations where they might be saved.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Check Common Locations
          </CardTitle>
          <CardDescription>
            Click to check each location for your project files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {commonLocations.map((location) => (
              <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{location.name}</span>
                    {checkedLocation === location.id && foundFiles === true && (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Found!
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{location.description}</p>
                  <p className="text-xs text-gray-500 font-mono">{location.path}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => checkLocation(location.id)}
                    disabled={checkedLocation === location.id}
                  >
                    {checkedLocation === location.id ? 'Checking...' : 'Check'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openFileExplorer(location.path)}
                  >
                    Open
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {foundFiles === false && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Files not found in checked location. Try checking other folders or re-download the files.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Still Can't Find Files?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Try these solutions:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Check your browser's download settings</li>
              <li>• Search your entire computer for the file name</li>
              <li>• Check if files were blocked by antivirus</li>
              <li>• Verify the download actually completed</li>
              <li>• Try downloading again</li>
            </ul>
          </div>
          <Button className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Re-download Project Files
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectLocationHelper;