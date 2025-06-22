import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Download, Github, Globe, Copy, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import DownloadProjectFiles from './DownloadProjectFiles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const CodeAccessGuide: React.FC = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const repoUrl = 'https://github.com/toma-shops/TomaShops-FamousAI';

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Access Your Code Files</h1>
        <p className="text-gray-600">Download, deploy, or access your TomaShops project files</p>
      </div>

      <Alert>
        <MapPin className="h-4 w-4" />
        <AlertDescription>
          <strong>Looking for downloaded files?</strong> They're saved to your Downloads folder at: 
          <code className="bg-gray-100 px-2 py-1 rounded ml-1">/storage/emulated/0/Download/</code>
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="download" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="download">Download Files</TabsTrigger>
          <TabsTrigger value="github">GitHub Setup</TabsTrigger>
          <TabsTrigger value="deploy">Deploy Online</TabsTrigger>
        </TabsList>
        
        <TabsContent value="download" className="space-y-4">
          <DownloadProjectFiles />
        </TabsContent>
        
        <TabsContent value="github" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Repository
              </CardTitle>
              <CardDescription>
                Access the official TomaShops repository
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-gray-100 p-3 rounded text-sm">
                  {repoUrl}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(repoUrl)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => window.open(repoUrl, '_blank')}
              >
                <Github className="mr-2 h-4 w-4" />
                Open GitHub Repository
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="deploy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Deploy Your App
              </CardTitle>
              <CardDescription>
                Host your TomaShops app online for free
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto p-4"
                  onClick={() => window.open('https://netlify.com', '_blank')}
                >
                  <div className="text-left">
                    <div className="font-semibold">Deploy to Netlify</div>
                    <div className="text-sm text-gray-600">Drag & drop deployment</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="justify-start h-auto p-4"
                  onClick={() => window.open('https://vercel.com', '_blank')}
                >
                  <div className="text-left">
                    <div className="font-semibold">Deploy to Vercel</div>
                    <div className="text-sm text-gray-600">Connect GitHub repo</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CodeAccessGuide;