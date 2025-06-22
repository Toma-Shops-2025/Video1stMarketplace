import React from 'react';
import CodeAccessGuide from '@/components/CodeAccessGuide';
import { AppLayout } from '@/components/AppLayout';

const CodeAccess = () => {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <CodeAccessGuide />
      </div>
    </AppLayout>
  );
};

export default CodeAccess;