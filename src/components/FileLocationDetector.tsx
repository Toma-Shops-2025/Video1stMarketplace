import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FolderOpen, Smartphone, Monitor, HelpCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const FileLocationDetector = () => {
  const [deviceType, setDeviceType] = useState<'pc' | 'android' | null>(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const detectDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('android')) {
      setDeviceType('android');
    } else {
      setDeviceType('pc');
    }
    setShowInstructions(true);
  };

  const openDownloadsFolder = () => {
    // For PC - try to open file explorer to Downloads
    if (deviceType === 'pc') {
      // Create a link that might help open file explorer
      const isWindows = navigator.userAgent.includes('Windows');
      const isMac = navigator.userAgent.includes('Mac');
      
      if (isWindows) {
        toast({
          title: 'Windows Instructions',
          description: 'Press Windows key + R, type "downloads" and press Enter to open Downloads folder',
        });
      } else if (isMac) {
        toast({
          title: 'Mac Instructions', 
          description: 'Press Cmd + Space, type "Downloads" and press Enter to open Downloads folder',
        });
      } else {
        toast({
          title: 'Linux Instructions',
          description: 'Open file manager and navigate to /home/[username]/Downloads',
        });
      }
    }
  };

  const PCInstructions = () => (
    <div className="space-y-4">
      <h3 className="font-semibold">PC/Laptop File Locations:</h3>
      <div className="space-y-2">
        <Alert>
          <FolderOpen className="h-4 w-4" />
          <AlertDescription>
            <strong>Windows:</strong> C:\Users\[YourName]\Downloads
          </AlertDescription>
        </Alert>
        <Alert>
          <FolderOpen className="h-4 w-4" />
          <AlertDescription>
            <strong>Mac:</strong> /Users/[YourName]/Downloads
          </AlertDescription>
        </Alert>
        <Alert>
          <FolderOpen className="h-4 w-4" />
          <AlertDescription>
            <strong>Linux:</strong> /home/[YourName]/Downloads
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Quick Access Methods:</h4>
        <ul className="list-disc pl-6 space-y-1 text-sm">
          <li><strong>Windows:</strong> Windows key + R → type "downloads" → Enter</li>
          <li><strong>Mac:</strong> Cmd + Space → type "Downloads" → Enter</li>
          <li><strong>Any Browser:</strong> Ctrl+J (or Cmd+J on Mac) to see download history</li>
        </ul>
      </div>
      
      <Button onClick={openDownloadsFolder} className="w-full">
        <FolderOpen className="h-4 w-4 mr-2" />
        Get Instructions to Open Downloads Folder
      </Button>
    </div>
  );

  const AndroidInstructions = () => (
    <div className="space-y-4">
      <h3 className="font-semibold">Android File Locations:</h3>
      <div className="space-y-2">
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            <strong>Downloads App:</strong> Look for "Downloads" app in your app drawer
          </AlertDescription>
        </Alert>
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            <strong>File Manager:</strong> Open "Files" or "My Files" app → Downloads folder
          </AlertDescription>
        </Alert>
        <Alert>
          <Smartphone className="h-4 w-4" />
          <AlertDescription>
            <strong>Browser Downloads:</strong> Chrome menu (3 dots) → Downloads
          </AlertDescription>
        </Alert>
      </div>
      
      <div className="space-y-2">
        <h4 className="font-medium">Step-by-Step:</h4>
        <ol className="list-decimal pl-6 space-y-1 text-sm">
          <li>Open your phone's "Files" or "My Files" app</li>
          <li>Look for "Downloads" or "Download" folder</li>
          <li>Check for files named "tomashops" or "project"</li>
          <li>If not found, check your browser's download section</li>
        </ol>
      </div>
    </div>
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5" />
          Find Your Downloaded Files
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showInstructions ? (
          <div className="space-y-4">
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertDescription>
                Let's help you find where your downloaded files are located on your device.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => { setDeviceType('pc'); setShowInstructions(true); }}
                variant="outline"
                className="h-20 flex flex-col gap-2"
              >
                <Monitor className="h-6 w-6" />
                PC/Laptop
              </Button>
              
              <Button 
                onClick={() => { setDeviceType('android'); setShowInstructions(true); }}
                variant="outline"
                className="h-20 flex flex-col gap-2"
              >
                <Smartphone className="h-6 w-6" />
                Android Phone
              </Button>
            </div>
            
            <Button onClick={detectDevice} className="w-full">
              Auto-Detect My Device
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {deviceType === 'pc' ? <PCInstructions /> : <AndroidInstructions />}
            
            <Button 
              onClick={() => { setShowInstructions(false); setDeviceType(null); }}
              variant="outline"
              className="w-full"
            >
              Choose Different Device
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileLocationDetector;