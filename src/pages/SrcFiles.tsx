import React from 'react';
import { AppLayout } from '@/components/AppLayout';
import { SrcFileExplorer } from '@/components/SrcFileExplorer';

const SrcFiles = () => {
  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Source Files Browser
          </h1>
          <p className="text-gray-600">
            Browse and view all files in the src folder of your project.
          </p>
        </div>
        <SrcFileExplorer />
      </div>
    </AppLayout>
  );
};

export default SrcFiles;