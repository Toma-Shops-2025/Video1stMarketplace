import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Monitor, Smartphone, Wifi, Cable, Cloud } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PCFileTransfer = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const transferMethods = [
    {
      id: 'cloud',
      title: 'Cloud Transfer (Recommended)',
      icon: Cloud,
      description: 'Upload to cloud and download on PC',
      steps: [
        'Upload files to Google Drive/Dropbox',
        'Open browser on your PC',
        'Sign in to same cloud account',
        'Download files to PC'
      ]
    },
    {
      id: 'cable',
      title: 'USB Cable Transfer',
      icon: Cable,
      description: 'Direct connection via USB',
      steps: [
        'Connect phone to PC with USB cable',
        'Enable File Transfer on phone',
        'Open File Explorer on PC',
        'Navigate to phone storage',
        'Copy files to PC'
      ]
    },
    {
      id: 'wifi',
      title: 'WiFi Transfer',
      icon: Wifi,
      description: 'Wireless transfer over same network',
      steps: [
        'Ensure both devices on same WiFi',
        'Use file sharing app',
        'Create hotspot on phone',
        'Connect PC and transfer files'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <Alert>
        <Monitor className="h-4 w-4" />
        <AlertDescription>
          You're now on your laptop/PC. Here are the best ways to get your project files from your phone to this computer.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {transferMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <Card 
              key={method.id} 
              className={`cursor-pointer transition-all ${
                selectedMethod === method.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </div>
                  {method.id === 'cloud' && (
                    <Badge variant="secondary">Easiest</Badge>
                  )}
                </div>
              </CardHeader>
              
              {selectedMethod === method.id && (
                <CardContent>
                  <div className="space-y-3">
                    <h4 className="font-medium">Step-by-step:</h4>
                    <ol className="space-y-2">
                      {method.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full min-w-[24px] text-center">
                            {index + 1}
                          </span>
                          <span className="text-sm">{step}</span>
                        </li>
                      ))}
                    </ol>
                    
                    {method.id === 'cloud' && (
                      <div className="mt-4 space-y-2">
                        <Button 
                          onClick={() => window.open('https://drive.google.com', '_blank')}
                          className="w-full"
                        >
                          Open Google Drive
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => window.open('https://dropbox.com', '_blank')}
                          className="w-full"
                        >
                          Open Dropbox
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default PCFileTransfer;