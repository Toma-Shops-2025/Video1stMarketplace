import ProjectFileExporter from './ProjectFileExporter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, Laptop, Server, Globe } from 'lucide-react';

const ProjectSaver = () => {
  return (
    <div className="space-y-8">
      <ProjectFileExporter />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Info className="h-5 w-5 text-blue-500" />
              What's Included
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full" />
                Complete React application source code
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                Build configuration files (Vite, Tailwind, etc.)
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full" />
                Package.json with all dependencies
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-orange-500 rounded-full" />
                Static assets and images
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 bg-red-500 rounded-full" />
                Deployment instructions
              </li>
            </ul>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Laptop className="h-5 w-5 text-green-500" />
              Deployment Options
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-500" />
                <span>Local development server</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-green-500" />
                <span>Static hosting (Netlify, Vercel)</span>
              </div>
              <div className="flex items-center gap-2">
                <Laptop className="h-4 w-4 text-purple-500" />
                <span>Self-hosted on your PC</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectSaver;