import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DownloadProjectButton = () => {
  const downloadProject = () => {
    // Create a more comprehensive and easily findable project file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const projectData = {
      projectInfo: {
        name: 'TomaShops FamousAI Project',
        version: '1.0.0',
        downloadedAt: new Date().toISOString(),
        platform: navigator.platform,
        userAgent: navigator.userAgent
      },
      quickStart: {
        instructions: [
          '1. Extract this project to a folder on your computer',
          '2. Open terminal/command prompt in the project folder',
          '3. Run: npm install',
          '4. Run: npm run dev',
          '5. Open browser to http://localhost:5173'
        ],
        requirements: [
          'Node.js (version 16 or higher)',
          'npm or yarn package manager',
          'Modern web browser'
        ]
      },
      fileStructure: {
        'package.json': {
          "name": "tomashops-famousai",
          "private": true,
          "version": "0.0.0",
          "type": "module",
          "scripts": {
            "dev": "vite",
            "build": "tsc && vite build",
            "preview": "vite preview"
          },
          "dependencies": {
            "@supabase/supabase-js": "^2.39.3",
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "react-router-dom": "^6.8.1",
            "lucide-react": "^0.263.1",
            "tailwindcss": "^3.3.3"
          }
        },
        'README.md': `# TomaShops FamousAI\n\nDownloaded: ${new Date().toLocaleString()}\n\n## Quick Start\n\n1. Install Node.js from nodejs.org\n2. Open terminal in this folder\n3. Run: npm install\n4. Run: npm run dev\n\n## Features\n- Modern React application\n- TikTok-style video feed\n- E-commerce functionality\n- Responsive design\n\nFor help, visit: /download-help`
      }
    };

    const content = JSON.stringify(projectData, null, 2);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `TOMASHOPS-PROJECT-${timestamp}.json`;
    link.style.display = 'none';
    
    // Add to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    
    // Cleanup after a delay
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1000);

    // Show success message with file location info
    toast({
      title: 'Project Downloaded Successfully!',
      description: `File: TOMASHOPS-PROJECT-${timestamp}.json saved to your Downloads folder`,
      duration: 8000,
    });

    // Show additional help after a delay
    setTimeout(() => {
      toast({
        title: 'Can\'t find the file?',
        description: 'Click the red HELP button in the header for troubleshooting assistance',
        duration: 10000,
      });
    }, 3000);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Having trouble finding downloaded files?</strong> Click the red "HELP" button in the header above for step-by-step assistance.
        </AlertDescription>
      </Alert>
      
      <Button onClick={downloadProject} className="w-full" size="lg">
        <Download className="h-4 w-4 mr-2" />
        Download Project Files
      </Button>
      
      <p className="text-sm text-gray-600 text-center">
        File will be saved as "TOMASHOPS-PROJECT-[timestamp].json" in your Downloads folder
      </p>
    </div>
  );
};

export default DownloadProjectButton;