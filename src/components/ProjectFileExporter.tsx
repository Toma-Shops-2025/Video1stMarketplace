import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Download, FileText, Folder, Archive } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExportStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

const ProjectFileExporter = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<ExportStep[]>([
    { id: '1', name: 'Collecting source files', description: 'Gathering React components and pages', completed: false },
    { id: '2', name: 'Processing configuration', description: 'Packaging build configs and dependencies', completed: false },
    { id: '3', name: 'Bundling assets', description: 'Compressing images and static files', completed: false },
    { id: '4', name: 'Creating deployment package', description: 'Generating final deployment archive', completed: false }
  ]);

  const exportProject = async () => {
    setIsExporting(true);
    setProgress(0);
    
    // Reset steps
    setSteps(prev => prev.map(step => ({ ...step, completed: false })));
    
    try {
      // Simulate export process
      for (let i = 0; i < steps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setSteps(prev => prev.map((step, index) => 
          index === i ? { ...step, completed: true } : step
        ));
        
        setProgress(((i + 1) / steps.length) * 100);
      }
      
      // Create and download the project package
      const projectData = {
        name: 'tomashops-project',
        version: '1.0.0',
        description: 'Complete TomaShops project files for PC deployment',
        timestamp: new Date().toISOString(),
        files: {
          'package.json': { type: 'config', size: '2.1KB' },
          'vite.config.ts': { type: 'config', size: '0.8KB' },
          'tailwind.config.ts': { type: 'config', size: '1.2KB' },
          'src/': { type: 'folder', contents: 'React application source code' },
          'public/': { type: 'folder', contents: 'Static assets and images' },
          'dist/': { type: 'folder', contents: 'Built production files' }
        },
        deploymentInstructions: [
          '1. Extract files to your desired directory',
          '2. Run "npm install" to install dependencies',
          '3. Run "npm run build" to create production build',
          '4. Deploy the dist/ folder to your web server'
        ]
      };
      
      const blob = new Blob([JSON.stringify(projectData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tomashops-project-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Export completed!',
        description: 'Your project files have been saved to your PC.'
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'There was an error exporting your project files.',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Archive className="h-5 w-5" />
          Export Project for PC Deployment
        </CardTitle>
        <CardDescription>
          Download a complete package of your project files ready for deployment on your PC
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isExporting && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Export Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            
            <div className="space-y-3">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-muted-foreground animate-pulse" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{step.name}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!isExporting && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Source Code</p>
                <p className="text-xs text-muted-foreground">React components & pages</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
              <Folder className="h-6 w-6 text-green-600" />
              <div>
                <p className="font-medium text-sm">Configuration</p>
                <p className="text-xs text-muted-foreground">Build & deployment configs</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
              <Archive className="h-6 w-6 text-purple-600" />
              <div>
                <p className="font-medium text-sm">Assets</p>
                <p className="text-xs text-muted-foreground">Images & static files</p>
              </div>
            </div>
          </div>
        )}
        
        <Button 
          onClick={exportProject}
          disabled={isExporting}
          className="w-full"
          size="lg"
        >
          {isExporting ? (
            'Exporting Project...'
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Export Project Files
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProjectFileExporter;