import type { ReactNode } from 'react';
import Topbar from './components/Topbar';

export default function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col flex-1 bg-gray-100 dark:bg-gray-900">
        {/* Sticky Topbar */}
        <div className="sticky top-0 z-10">
          <Topbar />
        </div>

        {/* Content area */}
        <div className="flex flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}



