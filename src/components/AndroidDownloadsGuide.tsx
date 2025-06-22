import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FolderOpen, Download, Smartphone, FileText } from "lucide-react";

const AndroidDownloadsGuide = () => {
  return (
    <div className="space-y-6">
      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertDescription>
          Your TomaShops project files should be saved to your Android Downloads folder for easy access and GitHub upload.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Save Project to Downloads
          </CardTitle>
          <CardDescription>
            Follow these steps to save your project files to Downloads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <p className="font-medium">Open your file manager app</p>
                <p className="text-sm text-gray-600">Look for "Files", "My Files", or "File Manager" on your phone</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <p className="font-medium">Navigate to Downloads folder</p>
                <p className="text-sm text-gray-600">Tap on "Downloads" or "Download" folder</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <p className="font-medium">Create TomaShops folder</p>
                <p className="text-sm text-gray-600">Create a new folder called "TomaShops-Project"</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <p className="font-medium">Copy all project files</p>
                <p className="text-sm text-gray-600">Move or copy all your React project files to this folder</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Downloads Path
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-3 rounded-md font-mono text-sm">
            /storage/emulated/0/Download/TomaShops-Project/
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This is the typical path where your project will be located
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Required Files
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>✓ package.json</div>
            <div>✓ src/ folder (with all components)</div>
            <div>✓ public/ folder</div>
            <div>✓ index.html</div>
            <div>✓ vite.config.ts</div>
            <div>✓ tailwind.config.ts</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AndroidDownloadsGuide;