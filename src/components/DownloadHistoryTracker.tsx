import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Download, Trash2, FileText } from 'lucide-react';

interface DownloadRecord {
  date: string;
  files: string[];
  timestamp: number;
}

const DownloadHistoryTracker = () => {
  const [downloadHistory, setDownloadHistory] = useState<DownloadRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    const history = localStorage.getItem('downloadHistory');
    if (history) {
      setDownloadHistory(JSON.parse(history));
    }
  }, []);

  const addDownloadRecord = (files: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: DownloadRecord = {
      date: today,
      files,
      timestamp: Date.now()
    };
    
    const updatedHistory = downloadHistory.filter(record => record.date !== today);
    updatedHistory.unshift(newRecord);
    
    setDownloadHistory(updatedHistory);
    localStorage.setItem('downloadHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setDownloadHistory([]);
    localStorage.removeItem('downloadHistory');
    localStorage.removeItem('lastProjectDownload');
  };

  const redownloadFromDate = (date: string) => {
    const record = downloadHistory.find(r => r.date === date);
    if (!record) return;

    record.files.forEach((filename, index) => {
      setTimeout(() => {
        const content = `# ${filename}\n\nRedownloaded from ${date}\n\nOriginal download: ${new Date(record.timestamp).toLocaleString()}`;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${date}-${filename}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, index * 300);
    });
  };

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const hasToday = downloadHistory.some(record => record.date === today);
  const hasYesterday = downloadHistory.some(record => record.date === yesterday);

  return (
    <div className="space-y-6">
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertDescription>
          {!hasToday && hasYesterday ? 
            "You only have yesterday's downloads. Download today's files to get the latest version." :
            "Track your download history and re-download files from any date."
          }
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Download History
          </CardTitle>
          <CardDescription>
            View and manage your project download history
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {downloadHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No downloads yet</p>
              <p className="text-sm">Download some project files to see your history</p>
            </div>
          ) : (
            <div className="space-y-3">
              {downloadHistory.map((record, index) => (
                <div key={record.date} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {record.date === today ? 'Today' : 
                         record.date === yesterday ? 'Yesterday' : 
                         record.date}
                      </span>
                      {record.date === today && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Latest</span>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => redownloadFromDate(record.date)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Re-download
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>{record.files.length} files downloaded</p>
                    <p className="text-xs">{new Date(record.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {downloadHistory.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={clearHistory}
              className="w-full mt-4"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadHistoryTracker;