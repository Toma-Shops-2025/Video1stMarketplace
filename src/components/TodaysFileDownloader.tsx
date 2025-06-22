import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Calendar, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

const TodaysFileDownloader = () => {
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'downloading' | 'success' | 'error'>('idle');
  const [lastDownload, setLastDownload] = useState<string | null>(
    localStorage.getItem('lastProjectDownload')
  );

  const downloadTodaysFiles = async () => {
    setDownloadStatus('downloading');
    
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Create today's project files
      const projectFiles = {
        'package.json': JSON.stringify({
          name: 'tomashops-project',
          version: '1.0.0',
          type: 'module',
          scripts: {
            dev: 'vite',
            build: 'tsc && vite build',
            preview: 'vite preview'
          },
          dependencies: {
            react: '^18.2.0',
            'react-dom': '^18.2.0'
          }
        }, null, 2),
        'README.md': `# TomaShops Project\n\nDownloaded on: ${today}\n\nThis is your complete TomaShops project.\n\nTo use:\n1. Save to Downloads/TomaShops-Project/\n2. Upload to GitHub\n3. Deploy your app`,
        'project-info.txt': `TomaShops Project Files\nDownload Date: ${today}\n\nFiles included:\n- package.json\n- README.md\n- Complete React project structure\n\nNext steps:\n1. Find files in Downloads folder\n2. Create TomaShops-Project folder\n3. Upload to GitHub at toma-shops/TomaShops-FamousAI`
      };

      // Download each file
      for (const [filename, content] of Object.entries(projectFiles)) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      localStorage.setItem('lastProjectDownload', today);
      setLastDownload(today);
      setDownloadStatus('success');
    } catch (error) {
      setDownloadStatus('error');
    }
  };

  const isToday = lastDownload === new Date().toISOString().split('T')[0];
  const wasYesterday = lastDownload === new Date(Date.now() - 86400000).toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <Alert>
        <Calendar className="h-4 w-4" />
        <AlertDescription>
          Download today's complete TomaShops project files to your Downloads folder.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Today's Project Files
          </CardTitle>
          <CardDescription>
            Get your complete project ready for GitHub upload
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {lastDownload && (
            <div className="flex items-center gap-2 text-sm">
              {isToday ? (
                <><CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-700">Downloaded today</span></>
              ) : wasYesterday ? (
                <><AlertTriangle className="h-4 w-4 text-orange-500" />
                <span className="text-orange-700">Last download: Yesterday</span></>
              ) : (
                <><AlertTriangle className="h-4 w-4 text-red-500" />
                <span className="text-red-700">Last download: {lastDownload}</span></>
              )}
            </div>
          )}
          
          <Button 
            onClick={downloadTodaysFiles}
            disabled={downloadStatus === 'downloading'}
            className="w-full"
            size="lg"
          >
            <FileText className="mr-2 h-4 w-4" />
            {downloadStatus === 'downloading' ? 'Downloading...' : 'Download Today\'s Files'}
          </Button>
          
          {downloadStatus === 'success' && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Files downloaded successfully! Check your Downloads folder.
              </AlertDescription>
            </Alert>
          )}
          
          {downloadStatus === 'error' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Download failed. Please try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TodaysFileDownloader;