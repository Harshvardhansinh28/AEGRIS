'use client';

import './globals.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { DataProvider } from '@/providers/DataProvider';
import NavSidebar from '@/components/layout/NavSidebar';
import TopBar from '@/components/layout/TopBar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <ThemeProvider>
          <DataProvider>
            <div className="flex h-screen w-full overflow-hidden">
              <NavSidebar />

              <div className="flex flex-col flex-1 overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-y-auto px-8 py-6">
                  {children}
                </main>
              </div>
            </div>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
