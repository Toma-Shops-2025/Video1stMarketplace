import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import DownloadDiagnosticTool from './DownloadDiagnosticTool';
import FileLocationDetector from './FileLocationDetector';

const DownloadTroubleshooter = () => {
  const [activeStep, setActiveStep] = useState(0);

  const forceDownload = () => {
    // Create a more obvious test file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const content = `TOMASHOPS PROJECT FILES - ${timestamp}

This is a test download to help you locate your Downloads folder.

If you can see this file, your downloads are working!

File created: ${new Date().toLocaleString()}
Browser: ${navigator.userAgent}
Platform: ${navigator.platform}

Look for this file in:
- Windows: C:\\Users\\[YourName]\\Downloads
- Mac: /Users/[YourName]/Downloads  
- Android: Downloads app or Files app > Downloads folder

If you found this file, your downloads are working correctly!`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `TOMASHOPS-TEST-${timestamp}.txt`;
    link.style.display = 'none';
    
    // Force the download with multiple methods
    document.body.appendChild(link);
    link.click();
    
    // Backup method
    setTimeout(() => {
      if (link.parentNode) {
        link.click();
      }
    }, 100);
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);

    toast({
      title: 'Test File Downloaded!',
      description: `Look for "TOMASHOPS-TEST-${timestamp}.txt" in your Downloads folder`,
      duration: 10000,
    });
  };

  const troubleshootingSteps = [
    {
      title: 'Check Browser Settings',
      content: (
        <div className="space-y-3">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your browser might be blocking downloads or saving them to a different location.
            </AlertDescription>
          </Alert>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li><strong>Chrome:</strong> Settings → Advanced → Downloads → Change download location</li>
            <li><strong>Firefox:</strong> Settings → General → Downloads → Save files to</li>
            <li><strong>Safari:</strong> Preferences → General → File download location</li>
            <li><strong>Edge:</strong> Settings → Downloads → Change download location</li>
          </ul>
          <Button onClick={() => setActiveStep(1)} className="w-full">
            Next: Test Download
          </Button>
        </div>
      )
    },
    {
      title: 'Test Download Function',
      content: (
        <div className="space-y-3">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Let's test if downloads work by creating a test file you can easily find.
            </AlertDescription>
          </Alert>
          <Button onClick={forceDownload} className="w-full mb-4">
            <Download className="h-4 w-4 mr-2" />
            Download Test File Now
          </Button>
          <p className="text-sm text-gray-600">
            This will create a file called "TOMASHOPS-TEST-[timestamp].txt" in your Downloads folder.
          </p>
          <Button onClick={() => setActiveStep(2)} variant="outline" className="w-full">
            Next: Find the File
          </Button>
        </div>
      )
    },
    {
      title: 'Locate Downloaded Files',
      content: (
        <div className="space-y-3">
          <FileLocationDetector />
          <Button onClick={() => setActiveStep(3)} variant="outline" className="w-full">
            Next: Advanced Diagnostics
          </Button>
        </div>
      )
    },
    {
      title: 'Advanced Diagnostics',
      content: (
        <div className="space-y-3">
          <DownloadDiagnosticTool />
          <Button onClick={() => setActiveStep(0)} variant="outline" className="w-full">
            <RefreshCw className="h-4 w-4 mr-2" />
            Start Over
          </Button>
        </div>
      )
    }
  ];

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Download Troubleshooter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={`step-${activeStep}`} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {troubleshootingSteps.map((step, index) => (
              <TabsTrigger 
                key={index} 
                value={`step-${index}`}
                onClick={() => setActiveStep(index)}
                className="text-xs"
              >
                {index + 1}. {step.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {troubleshootingSteps.map((step, index) => (
            <TabsContent key={index} value={`step-${index}`} className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{step.title}</h3>
                {step.content}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DownloadTroubleshooter;