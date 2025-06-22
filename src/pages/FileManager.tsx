import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { FileExplorer } from '@/components/FileExplorer';
import { FileViewer } from '@/components/FileViewer';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { useFileContent } from '@/hooks/useFileContent';

// List of all available files in the project
const PROJECT_FILES = [
  '.github/workflows/deploy.yml',
  '.gitignore',
  'BUILD_GUIDE.md',
  'CONTRIBUTING.md',
  'DEPLOYMENT_CHECKLIST.md',
  'DEPLOYMENT_GUIDE.md',
  'GITHUB_SETUP.md',
  'LICENSE',
  'MIGRATION_GUIDE.md',
  'QUICK_START.md',
  'README.md',
  'TROUBLESHOOTING.md',
  'components.json',
  'eslint.config.js',
  'index.html',
  'netlify.toml',
  'package.json',
  'postcss.config.js',
  'public/_redirects',
  'public/placeholder.svg',
  'public/robots.txt',
  'src/App.css',
  'src/App.tsx',
  'src/index.css',
  'src/lib/supabase.ts',
  'src/lib/utils.ts',
  'src/main.tsx',
  'tailwind.config.ts',
  'tsconfig.app.json',
  'tsconfig.json',
  'tsconfig.node.json',
  'vercel.json',
  'vite.config.ts'
];

const FileManager = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const { getFileContent, loading, error } = useFileContent();

  const handleFileSelect = async (filename: string) => {
    setSelectedFile(filename);
    
    try {
      const content = await getFileContent(filename);
      setFileContent(content);
    } catch (err) {
      // Error is handled by the hook
      setFileContent('');
    }
  };

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Project File Manager</h1>
          <p className="text-gray-600">
            Browse and access all files in your project. Select a file from the explorer to view its contents.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <FileExplorer
              files={PROJECT_FILES}
              onFileSelect={handleFileSelect}
              selectedFile={selectedFile || undefined}
            />
          </div>

          <div>
            {!selectedFile ? (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Select a file to view its contents</p>
                </CardContent>
              </Card>
            ) : loading ? (
              <Card className="h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p>Loading file...</p>
                </CardContent>
              </Card>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : (
              <FileViewer
                filename={selectedFile}
                content={fileContent}
                title={`File: ${selectedFile}`}
              />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default FileManager;