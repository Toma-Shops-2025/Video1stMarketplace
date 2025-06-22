import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Folder, Search } from 'lucide-react';

interface FileExplorerProps {
  files: string[];
  onFileSelect: (filename: string) => void;
  selectedFile?: string;
}

export const FileExplorer = ({ files, onFileSelect, selectedFile }: FileExplorerProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFiles = files.filter(file => 
    file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedFiles = filteredFiles.reduce((acc, file) => {
    const parts = file.split('/');
    const dir = parts.length > 1 ? parts[0] : 'root';
    if (!acc[dir]) acc[dir] = [];
    acc[dir].push(file);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Card className="w-full h-96">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Project Files
        </CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-64">
          {Object.entries(groupedFiles).map(([dir, dirFiles]) => (
            <div key={dir} className="p-2">
              <div className="font-medium text-sm text-gray-600 mb-2 px-2">
                {dir}
              </div>
              {dirFiles.map(file => (
                <Button
                  key={file}
                  variant={selectedFile === file ? 'default' : 'ghost'}
                  className="w-full justify-start text-left h-auto py-2 px-4 mb-1"
                  onClick={() => onFileSelect(file)}
                >
                  <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{file.split('/').pop()}</span>
                </Button>
              ))}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};