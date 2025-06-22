import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FolderOpen, Settings, Download, HelpCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DownloadLocationHelper = () => {
  const [browserType, setBrowserType] = useState<string>('chrome');

  const browserInstructions = {
    chrome: {
      name: 'Google Chrome',
      steps: [
        'Click the three dots menu (⋮) in top right',
        'Go to Settings',
        'Click "Advanced" then "Downloads"',
        'See "Location" - this is where files download',
        'Click "Change" to pick a new location'
      ]
    },
    firefox: {
      name: 'Mozilla Firefox',
      steps: [
        'Click the menu button (☰) in top right',
        'Select "Settings"',
        'Scroll down to "Files and Applications"',
        'See download location under "Downloads"',
        'Click "Browse" to change location'
      ]
    },
    edge: {
      name: 'Microsoft Edge',
      steps: [
        'Click the three dots menu (...) in top right',
        'Go to Settings',
        'Click "Downloads" in the left sidebar',
        'See "Location" section',
        'Click "Change" to select new folder'
      ]
    }
  };

  const openDownloadsFolder = () => {
    // This would open the downloads folder in a real app
    alert('Opening Downloads folder...\n\nIn a real app, this would open your Downloads folder.');
  };

  const showFileSearch = () => {
    alert('Search tip:\n\nPress Windows key + S, then type the name of your project file to search your entire computer.');
  };

  return (
    <div className="space-y-6">
      <Alert>
        <HelpCircle className="h-4 w-4" />
        <AlertDescription>
          Can't find your downloaded project files? Let's check where your browser saves downloads.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="location" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="location">Find Downloads</TabsTrigger>
          <TabsTrigger value="browser">Browser Settings</TabsTrigger>
          <TabsTrigger value="search">Search Computer</TabsTrigger>
        </TabsList>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                Quick Access to Downloads
              </CardTitle>
              <CardDescription>
                Most files download to your Downloads folder by default
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={openDownloadsFolder} className="w-full">
                <FolderOpen className="h-4 w-4 mr-2" />
                Open Downloads Folder
              </Button>
              
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Common download locations:</p>
                <ul className="space-y-1">
                  <li>• C:\Users\[YourName]\Downloads</li>
                  <li>• Desktop</li>
                  <li>• Documents folder</li>
                  <li>• Custom folder you selected</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="browser" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Check Browser Download Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  {Object.entries(browserInstructions).map(([key, browser]) => (
                    <Button
                      key={key}
                      variant={browserType === key ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setBrowserType(key)}
                    >
                      {browser.name}
                    </Button>
                  ))}
                </div>
                
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-3">
                    {browserInstructions[browserType as keyof typeof browserInstructions].name} Instructions:
                  </h4>
                  <ol className="space-y-2">
                    {browserInstructions[browserType as keyof typeof browserInstructions].steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Your Entire Computer</CardTitle>
              <CardDescription>
                If files aren't in the usual places, search for them
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={showFileSearch} className="w-full">
                Show Search Instructions
              </Button>
              
              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Search tips:</p>
                <ul className="space-y-1">
                  <li>• Press Windows key + S to open search</li>
                  <li>• Type the project file name</li>
                  <li>• Look for .zip files or folder names</li>
                  <li>• Check "Recent" files in File Explorer</li>
                  <li>• Search for files modified today</li>
                </ul>
              </div>
              
              <Alert>
                <Download className="h-4 w-4" />
                <AlertDescription>
                  Still can't find them? The download might have failed. Try downloading again.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DownloadLocationHelper;