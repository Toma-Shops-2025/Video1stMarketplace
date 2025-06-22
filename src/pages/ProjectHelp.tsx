import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import ProjectLocationHelper from '@/components/ProjectLocationHelper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

const ProjectHelp: React.FC = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Need Help Finding Your Project?</h1>
            <p className="text-lg text-gray-600">
              Don't worry! We'll help you locate your TomaShops project and get it online.
            </p>
          </div>

          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              Your project contains all the files needed to run your website. 
              It might be stored on your phone, in cloud storage, or on GitHub.
            </AlertDescription>
          </Alert>

          <ProjectLocationHelper />

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>What is GitHub?</CardTitle>
                <CardDescription>
                  A place where developers store their code online
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• Free online storage for code</li>
                  <li>• Accessible from any device</li>
                  <li>• Automatically backs up your work</li>
                  <li>• Easy to share with others</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What files make up your project?</CardTitle>
                <CardDescription>
                  Your TomaShops website consists of many files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>• HTML, CSS, and JavaScript files</li>
                  <li>• Images and other media</li>
                  <li>• Configuration files</li>
                  <li>• Package and dependency information</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Still Can't Find Your Project?</CardTitle>
              <CardDescription>
                Here are some other places to check
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Check Your Downloads Folder</h4>
                  <p className="text-sm text-gray-600">
                    If you downloaded the project, it might be in your Downloads folder.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Check Cloud Storage</h4>
                  <p className="text-sm text-gray-600">
                    Look in Google Drive, Dropbox, or other cloud storage apps.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Ask Who Helped You</h4>
                  <p className="text-sm text-gray-600">
                    If someone helped you create this project, ask them where it's stored.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default ProjectHelp;