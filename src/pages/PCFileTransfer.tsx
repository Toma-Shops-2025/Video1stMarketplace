import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, Smartphone, ArrowRight } from 'lucide-react';
import PCFileTransfer from '@/components/PCFileTransfer';
import PCDownloadHelper from '@/components/PCDownloadHelper';

const PCFileTransferPage = () => {
  const [activeTab, setActiveTab] = useState('download');

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Smartphone className="h-8 w-8 text-blue-600" />
            <ArrowRight className="h-6 w-6 text-gray-400" />
            <Monitor className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            Transfer Files to Your PC
          </h1>
          <p className="text-gray-600 mb-4">
            Get your project files from your phone to your laptop/computer
          </p>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            You're on PC/Laptop
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="download">Direct Download</TabsTrigger>
            <TabsTrigger value="transfer">Transfer Methods</TabsTrigger>
          </TabsList>
          
          <TabsContent value="download" className="mt-6">
            <PCDownloadHelper />
          </TabsContent>
          
          <TabsContent value="transfer" className="mt-6">
            <PCFileTransfer />
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
            <CardDescription>
              Having trouble getting your files? Here are some quick tips.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">File Locations</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Downloads folder (most common)</li>
                  <li>• Desktop (if saved there)</li>
                  <li>• Documents folder</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">File Types</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• .zip files (compressed)</li>
                  <li>• .apk files (Android apps)</li>
                  <li>• Source code files</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PCFileTransferPage;