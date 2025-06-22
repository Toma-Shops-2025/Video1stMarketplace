import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FolderSearch, Monitor, Smartphone } from 'lucide-react';
import ProjectLocationHelper from '@/components/ProjectLocationHelper';
import DownloadLocationHelper from '@/components/DownloadLocationHelper';
import PCFileTransfer from '@/components/PCFileTransfer';

const ProjectLocation = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
          <FolderSearch className="h-8 w-8 text-blue-600" />
          Find Your Project Files
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Can't find your downloaded project files? We'll help you locate them on your computer or transfer them from your phone.
        </p>
      </div>

      <Alert className="mb-6">
        <Monitor className="h-4 w-4" />
        <AlertDescription>
          Choose the option that matches your situation: files missing on this computer, or need to transfer from phone to PC.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="missing" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="missing" className="flex items-center gap-2">
            <FolderSearch className="h-4 w-4" />
            Files Missing
          </TabsTrigger>
          <TabsTrigger value="downloads" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Check Downloads
          </TabsTrigger>
          <TabsTrigger value="transfer" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Phone to PC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="missing" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Files Not Showing Up?</CardTitle>
              <CardDescription>
                Let's check common locations where your project files might be saved
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectLocationHelper />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="downloads" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Check Your Download Location</CardTitle>
              <CardDescription>
                Find out where your browser saves downloaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DownloadLocationHelper />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfer" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Transfer Files from Phone to PC</CardTitle>
              <CardDescription>
                Get your project files from your phone to this computer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PCFileTransfer />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectLocation;