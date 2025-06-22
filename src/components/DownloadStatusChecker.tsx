import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, FolderOpen } from 'lucide-react';

const DownloadStatusChecker = () => {
  const [status, setStatus] = useState<'checking' | 'empty' | 'yesterday-only' | 'has-today' | 'error'>('checking');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkDownloadStatus = () => {
    setStatus('checking');
    
    try {
      const lastDownload = localStorage.getItem('lastProjectDownload');
      const downloadHistory = localStorage.getItem('downloadHistory');
      
      const today = new Date().toISOString().split('T')[0];
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      
      if (!lastDownload && !downloadHistory) {
        setStatus('empty');
      } else if (lastDownload === today) {
        setStatus('has-today');
      } else if (lastDownload === yesterday) {
        setStatus('yesterday-only');
      } else {
        setStatus('empty');
      }
      
      setLastCheck(new Date());
    } catch (error) {
      setStatus('error');
    }
  };

  useEffect(() => {
    checkDownloadStatus();
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'checking':
        return <RefreshCw className="h-5 w-5 animate-spin" />;
      case 'has-today':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'yesterday-only':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'empty':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'checking':
        return 'Checking your downloads...';
      case 'has-today':
        return 'You have today\'s files! ✅';
      case 'yesterday-only':
        return 'You only have yesterday\'s files';
      case 'empty':
        return 'No downloads found';
      case 'error':
        return 'Error checking downloads';
    }
  };

  const getRecommendation = () => {
    switch (status) {
      case 'has-today':
        return 'Your downloads are up to date. You can proceed with uploading to GitHub.';
      case 'yesterday-only':
        return 'Download today\'s files to get the latest version of your project.';
      case 'empty':
        return 'Start by downloading your project files to get started.';
      case 'error':
        return 'Try refreshing or clearing your browser cache.';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Download Status
          </CardTitle>
          <CardDescription>
            Check what files you have in your downloads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="text-lg font-medium mb-2">
              {getStatusMessage()}
            </div>
            <div className="text-sm text-gray-600">
              {getRecommendation()}
            </div>
          </div>
          
          {status === 'yesterday-only' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Action needed:</strong> You only have yesterday's files. Download today's version to get the latest updates and features.
              </AlertDescription>
            </Alert>
          )}
          
          {status === 'empty' && (
            <Alert>
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>No files found:</strong> Start by downloading your project files. They'll be saved to your Downloads folder.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={checkDownloadStatus}
              variant="outline"
              size="sm"
              disabled={status === 'checking'}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${status === 'checking' ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
            
            <Button
              onClick={() => {
                // Open file manager hint
                alert('Open your file manager app and navigate to Downloads folder to see your files.');
              }}
              variant="outline"
              size="sm"
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              Check Downloads
            </Button>
          </div>
          
          {lastCheck && (
            <div className="text-xs text-gray-500 text-center">
              Last checked: {lastCheck.toLocaleTimeString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadStatusChecker;