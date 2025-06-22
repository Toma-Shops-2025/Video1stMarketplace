import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HelpCircle, Download, AlertTriangle } from 'lucide-react';
import DownloadTroubleshooter from '@/components/DownloadTroubleshooter';
import AppLayout from '@/components/AppLayout';

const DownloadHelp = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Download Help Center
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Can't find your downloaded files? Let's solve this step by step.
            </p>
          </div>

          <div className="space-y-8">
            {/* Main Issue Alert */}
            <Alert className="border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-700">
                <strong>Common Issue:</strong> Files are downloading but you can't find them on your device. 
                This usually means they're saved in a default location you haven't checked yet.
              </AlertDescription>
            </Alert>

            {/* Quick Solutions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Quick Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-green-700">✅ For PC/Laptop Users:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Press <kbd className="px-2 py-1 bg-gray-100 rounded">Ctrl + J</kbd> to see browser downloads</li>
                      <li>• Check your Downloads folder (usually C:\Users\[Name]\Downloads)</li>
                      <li>• Look for files starting with "tomashops" or "project"</li>
                      <li>• Try downloading our test file below</li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h3 className="font-semibold text-blue-700">📱 For Android Users:</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Open "Downloads" app from your app drawer</li>
                      <li>• Check "Files" or "My Files" app → Downloads folder</li>
                      <li>• In Chrome: Menu (3 dots) → Downloads</li>
                      <li>• Look in /storage/emulated/0/Download/</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Troubleshooter */}
            <DownloadTroubleshooter />

            {/* Additional Help */}
            <Card>
              <CardHeader>
                <CardTitle>Still Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <Download className="h-4 w-4" />
                    <AlertDescription>
                      If the troubleshooter above doesn't solve your issue, the problem might be:
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Browser Blocking</h4>
                      <p>Your browser security settings might be preventing downloads. Check if downloads are enabled in settings.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Antivirus Software</h4>
                      <p>Some antivirus programs quarantine downloaded files. Check your antivirus quarantine folder.</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Storage Full</h4>
                      <p>If your device storage is full, downloads might fail silently. Free up some space and try again.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DownloadHelp;