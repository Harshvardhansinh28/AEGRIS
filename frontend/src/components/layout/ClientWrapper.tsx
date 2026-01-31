'use client';

import React from 'react';
import NavSidebar from './NavSidebar';
import Background3D from '../ui/Background3D';
import TopBar from './TopBar';
import Chatbot from '../chat/Chatbot';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen relative">
      <Background3D />
      <NavSidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen relative z-10 font-[family-name:var(--font-inter)]">
        <TopBar />
        {children}
      </main>
      <Chatbot />
    </div>
  );
}
