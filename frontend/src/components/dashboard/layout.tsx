'use client';

import NavSidebar from '@/components/layout/NavSidebar';
import TopBar from '@/components/layout/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[var(--bg-primary)]">
      {/* Sidebar */}
      <NavSidebar />

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
