import { AppLayout } from '@/components/AppLayout';
import ProjectFileDownloader from '@/components/ProjectFileDownloader';
import DownloadLocationHelper from '@/components/DownloadLocationHelper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Search, HelpCircle } from 'lucide-react';

const ProjectSaver = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Save Your Project</h1>
            <p className="text-gray-600">
              Download your TomaShops project files for deployment
            </p>
          </div>

          <Tabs defaultValue="download" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="download" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download
              </TabsTrigger>
              <TabsTrigger value="find" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Find Files
              </TabsTrigger>
              <TabsTrigger value="help" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                Help
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="download" className="mt-6">
              <ProjectFileDownloader />
            </TabsContent>
            
            <TabsContent value="find" className="mt-6">
              <DownloadLocationHelper />
            </TabsContent>
            
            <TabsContent value="help" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                  <CardDescription>
                    Common issues and solutions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium">Can't find downloaded files?</h4>
                      <p className="text-sm text-gray-600">
                        Check your Downloads folder or use the "Find Files" tab above
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Only seeing yesterday's files?</h4>
                      <p className="text-sm text-gray-600">
                        Use the "Download Today's Files" button to get files with today's date
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium">Files not downloading?</h4>
                      <p className="text-sm text-gray-600">
                        Check your browser's download settings and popup blockers
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectSaver;