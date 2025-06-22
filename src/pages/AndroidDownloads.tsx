import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AndroidDownloadsGuide from "@/components/AndroidDownloadsGuide";
import DownloadProjectFiles from "@/components/DownloadProjectFiles";
import GitHubUploadHelper from "@/components/GitHubUploadHelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Smartphone, Download, Upload, Github, AlertTriangle } from "lucide-react";

const AndroidDownloads = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <Smartphone className="h-8 w-8" />
              Android Downloads Setup
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Complete guide to save your TomaShops project to Downloads and upload to GitHub from your Android device.
            </p>
          </div>

          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Issue:</strong> If you only have yesterday's files in Downloads, download today's version to get the latest updates.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="files" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="files" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Get Today's Files
              </TabsTrigger>
              <TabsTrigger value="downloads" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Downloads Guide
              </TabsTrigger>
              <TabsTrigger value="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                Upload to GitHub
              </TabsTrigger>
            </TabsList>

            <TabsContent value="files" className="mt-6">
              <DownloadProjectFiles />
            </TabsContent>

            <TabsContent value="downloads" className="mt-6">
              <AndroidDownloadsGuide />
            </TabsContent>

            <TabsContent value="github" className="mt-6">
              <GitHubUploadHelper />
            </TabsContent>
          </Tabs>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Quick Summary
              </CardTitle>
              <CardDescription>
                Everything you need to know in one place
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <Download className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <h3 className="font-semibold mb-1">1. Download Today's Files</h3>
                  <p className="text-sm text-gray-600">Get the latest version, not yesterday's</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Smartphone className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <h3 className="font-semibold mb-1">2. Save to Downloads</h3>
                  <p className="text-sm text-gray-600">Put in Downloads/TomaShops-Project/</p>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <Github className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <h3 className="font-semibold mb-1">3. Upload to GitHub</h3>
                  <p className="text-sm text-gray-600">Push to toma-shops/TomaShops-FamousAI</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default AndroidDownloads;