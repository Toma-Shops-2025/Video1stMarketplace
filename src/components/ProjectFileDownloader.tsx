import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileArchive, FolderDown, CheckCircle, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import TodaysFileDownloader from './TodaysFileDownloader';

const ProjectFileDownloader = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadProjectFiles = async () => {
    setIsDownloading(true);
    
    try {
      // Create project files content
      const projectFiles = {
        'package.json': JSON.stringify({
          "name": "tomashops-project",
          "version": "1.0.0",
          "type": "module",
          "scripts": {
            "dev": "vite",
            "build": "tsc && vite build",
            "preview": "vite preview"
          },
          "dependencies": {
            "react": "^18.2.0",
            "react-dom": "^18.2.0",
            "@radix-ui/react-slot": "^1.0.2",
            "class-variance-authority": "^0.7.0",
            "clsx": "^2.0.0",
            "lucide-react": "^0.263.1",
            "tailwind-merge": "^1.14.0",
            "tailwindcss-animate": "^1.0.7"
          },
          "devDependencies": {
            "@types/react": "^18.2.15",
            "@types/react-dom": "^18.2.7",
            "@typescript-eslint/eslint-plugin": "^6.0.0",
            "@typescript-eslint/parser": "^6.0.0",
            "@vitejs/plugin-react": "^4.0.3",
            "autoprefixer": "^10.4.14",
            "eslint": "^8.45.0",
            "eslint-plugin-react-hooks": "^4.6.0",
            "eslint-plugin-react-refresh": "^0.4.3",
            "postcss": "^8.4.27",
            "tailwindcss": "^3.3.0",
            "typescript": "^5.0.2",
            "vite": "^4.4.5"
          }
        }, null, 2),
        'README.md': `# TomaShops Project\n\nComplete project files for deployment.\n\n## Setup\n1. Run \`npm install\`\n2. Run \`npm run dev\` for development\n3. Run \`npm run build\` for production\n\n## Deployment\nUpload to your preferred hosting service.`,
        'deployment-guide.txt': `TomaShops Deployment Guide\n\nFiles saved to: ${navigator.userAgent.includes('Android') ? '/storage/emulated/0/Download/TomaShops-Project/' : 'Downloads folder'}\n\nSteps:\n1. Find downloaded files in your Downloads folder\n2. Extract if compressed\n3. Upload to GitHub or hosting service\n4. Run npm install\n5. Run npm run build\n6. Deploy dist folder\n\nTimestamp: ${new Date().toLocaleString()}`
      };

      // Create and download each file
      Object.entries(projectFiles).forEach(([filename, content]) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });

      toast({
        title: 'Files Downloaded!',
        description: `Project files saved to your Downloads folder at ${new Date().toLocaleTimeString()}`
      });
    } catch (error) {
      toast({
        title: 'Download Failed',
        description: 'There was an error downloading your files.',
        variant: 'destructive'
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8">
      <TodaysFileDownloader />
      
      <div className="border-t pt-6">
        <Alert>
          <FolderDown className="h-4 w-4" />
          <AlertDescription>
            Alternative: Download standard project files (without date)
          </AlertDescription>
        </Alert>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Standard Project Download
            </CardTitle>
            <CardDescription>
              Get basic project files without date stamps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={downloadProjectFiles}
              disabled={isDownloading}
              className="w-full"
              size="lg"
              variant="outline"
            >
              <FileArchive className="mr-2 h-4 w-4" />
              {isDownloading ? 'Downloading...' : 'Download Standard Files'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectFileDownloader;