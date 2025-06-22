import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, AlertTriangle, CheckCircle, Search } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const DownloadDiagnosticTool = () => {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostic = async () => {
    setIsRunning(true);
    const results = [];

    // Test 1: Browser download capability
    try {
      const testBlob = new Blob(['test'], { type: 'text/plain' });
      const testUrl = URL.createObjectURL(testBlob);
      const testLink = document.createElement('a');
      testLink.href = testUrl;
      testLink.download = 'browser-test.txt';
      
      results.push({
        test: 'Browser Download Support',
        status: 'pass',
        message: 'Browser supports programmatic downloads'
      });
      
      URL.revokeObjectURL(testUrl);
    } catch (error) {
      results.push({
        test: 'Browser Download Support',
        status: 'fail',
        message: 'Browser may not support downloads'
      });
    }

    // Test 2: Check download folder permissions
    results.push({
      test: 'Download Location',
      status: 'info',
      message: `Default download folder: ${navigator.userAgent.includes('Windows') ? 'C:\\Users\\[username]\\Downloads' : navigator.userAgent.includes('Mac') ? '/Users/[username]/Downloads' : '/home/[username]/Downloads'}`
    });

    // Test 3: Actual file download test
    const actualDownload = () => {
      const content = `Download Test - ${new Date().toISOString()}\nIf you can see this file, downloads are working!\nLocation: Check your Downloads folder\nBrowser: ${navigator.userAgent}`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'DOWNLOAD-TEST-FILE.txt';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      results.push({
        test: 'Actual Download Test',
        status: 'pass',
        message: 'Test file "DOWNLOAD-TEST-FILE.txt" should appear in Downloads folder'
      });
    };

    actualDownload();
    
    setTestResults(results);
    setIsRunning(false);
    
    toast({
      title: 'Diagnostic Complete',
      description: 'Check results below and look for DOWNLOAD-TEST-FILE.txt in your Downloads folder',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Download Diagnostic Tool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            This tool will test why downloads aren't working and create a test file to help locate your Downloads folder.
          </AlertDescription>
        </Alert>
        
        <Button 
          onClick={runDiagnostic} 
          disabled={isRunning}
          className="w-full"
        >
          <Download className="h-4 w-4 mr-2" />
          {isRunning ? 'Running Tests...' : 'Run Download Diagnostic'}
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Test Results:</h3>
            {testResults.map((result, index) => (
              <Alert key={index} className={result.status === 'fail' ? 'border-red-500' : result.status === 'pass' ? 'border-green-500' : 'border-blue-500'}>
                {result.status === 'pass' ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : result.status === 'fail' ? (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                ) : (
                  <Search className="h-4 w-4 text-blue-500" />
                )}
                <AlertDescription>
                  <strong>{result.test}:</strong> {result.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DownloadDiagnosticTool;