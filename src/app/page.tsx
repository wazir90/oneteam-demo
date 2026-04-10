'use client';

import { TopBar } from '@/components/TopBar';
import { Sidebar } from '@/components/Sidebar';
import { FormsSidebar } from '@/components/FormsSidebar';
import { FormsContent } from '@/components/FormsContent';
import { ControlBar } from '@/components/ControlBar';

export default function Home() {
  return (
    <div className="app-layout">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <FormsSidebar />
        <FormsContent />
      </div>
      <ControlBar />
    </div>
  );
}
