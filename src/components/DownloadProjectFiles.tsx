import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, FileArchive, Smartphone, CheckCircle, MapPin } from "lucide-react";
import AndroidDownloadLocationGuide from './AndroidDownloadLocationGuide';
import TodaysFileDownloader from './TodaysFileDownloader';
import DownloadHistoryTracker from './DownloadHistoryTracker';
import DownloadStatusChecker from './DownloadStatusChecker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DownloadProjectFiles = () => {
  const downloadAsZip = () => {
    const projectStructure = `TomaShops Project Structure

Required Files:
- package.json
- index.html
- vite.config.ts
- tailwind.config.ts
- tsconfig.json
- src/
  - main.tsx
  - App.tsx
  - index.css
  - components/
  - pages/
  - lib/
  - contexts/
- public/

Save all these files to:
/storage/emulated/0/Download/TomaShops-Project/

Then upload to GitHub at:
https://github.com/toma-shops/TomaShops-FamousAI`;

    const blob = new Blob([projectStructure], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'TomaShops-Project-Structure.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertDescription>
          Download your project files directly to your Android Downloads folder for easy GitHub upload.
        </AlertDescription>
      </Alert>

      <DownloadStatusChecker />

      <Tabs defaultValue="today" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today's Files</TabsTrigger>
          <TabsTrigger value="history">Download History</TabsTrigger>
          <TabsTrigger value="location">Find Files</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="mt-6">
          <TodaysFileDownloader />
        </TabsContent>

        <TabsContent value="history" className="mt-6">
          <DownloadHistoryTracker />
        </TabsContent>

        <TabsContent value="location" className="mt-6">
          <AndroidDownloadLocationGuide />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Legacy Download
          </CardTitle>
          <CardDescription>
            Download project structure guide (backup method)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={downloadAsZip}
            variant="outline"
            className="w-full"
          >
            <FileArchive className="mr-2 h-4 w-4" />
            Download Project Structure Guide
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DownloadProjectFiles;