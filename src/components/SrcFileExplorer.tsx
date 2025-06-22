import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Folder, File, Search } from 'lucide-react';
import { SrcFileViewer } from './SrcFileViewer';
import { useSrcFileContent } from '@/hooks/useSrcFileContent';

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileItem[];
}

const srcFiles: FileItem[] = [
  {
    name: 'components',
    type: 'folder',
    path: 'src/components',
    children: [
      { name: 'Header.tsx', type: 'file', path: 'src/components/Header.tsx' },
      { name: 'Footer.tsx', type: 'file', path: 'src/components/Footer.tsx' },
      { name: 'ProductCard.tsx', type: 'file', path: 'src/components/ProductCard.tsx' },
      { name: 'AuthModal.tsx', type: 'file', path: 'src/components/AuthModal.tsx' },
    ]
  },
  {
    name: 'pages',
    type: 'folder',
    path: 'src/pages',
    children: [
      { name: 'Index.tsx', type: 'file', path: 'src/pages/Index.tsx' },
      { name: 'VideoFeed.tsx', type: 'file', path: 'src/pages/VideoFeed.tsx' },
      { name: 'Profile.tsx', type: 'file', path: 'src/pages/Profile.tsx' },
    ]
  },
  { name: 'App.tsx', type: 'file', path: 'src/App.tsx' },
  { name: 'main.tsx', type: 'file', path: 'src/main.tsx' },
  { name: 'index.css', type: 'file', path: 'src/index.css' },
];

export const SrcFileExplorer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const { getFileContent } = useSrcFileContent();

  const toggleFolder = (path: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFileTree = (items: FileItem[], level = 0) => {
    return items.map((item) => {
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return null;
      }

      return (
        <div key={item.path} style={{ marginLeft: level * 20 }}>
          <div className="flex items-center py-1 hover:bg-gray-100 cursor-pointer rounded">
            {item.type === 'folder' ? (
              <>
                <Folder className="h-4 w-4 mr-2 text-blue-500" />
                <span onClick={() => toggleFolder(item.path)}>{item.name}</span>
              </>
            ) : (
              <>
                <File className="h-4 w-4 mr-2 text-gray-500" />
                <span onClick={() => setSelectedFile(item.path)}>{item.name}</span>
              </>
            )}
          </div>
          {item.type === 'folder' && expandedFolders.has(item.path) && item.children && (
            <div>{renderFileTree(item.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Src Files</CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="max-h-96 overflow-auto">
          {renderFileTree(srcFiles)}
        </CardContent>
      </Card>

      {selectedFile && (
        <SrcFileViewer
          filename={selectedFile.split('/').pop() || ''}
          content={getFileContent(selectedFile)}
        />
      )}
    </div>
  );
};