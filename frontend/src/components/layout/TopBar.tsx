'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Shield } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

function useTime() {
  const [t, setT] = useState('');
  useEffect(() => {
    const f = () => setT(new Date().toISOString().slice(11, 19) + ' UTC');
    f();
    const id = setInterval(f, 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

export default function TopBar() {
  const time = useTime();
  const pathname = usePathname();

  return (
    <header className="flex justify-between items-center mb-8 pb-6 border-b border-[var(--border-primary)]">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-lg bg-[var(--accent-primary)] flex items-center justify-center shadow-md">
            <Shield size={20} className="text-[var(--bg-primary)]" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
            AegisRL™ <span className="text-[var(--text-secondary)] font-semibold">Enterprise AI</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {[
            { label: 'Dashboard', href: '/' },
            { label: 'Portfolio', href: '/portfolio' },
            { label: 'AI Training', href: '/training' },
            { label: 'Settings', href: '/settings' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`px-4 py-2 text-sm font-medium rounded-lg hover:bg-[var(--bg-elevated)] transition-colors ${pathname === href ? 'text-[var(--accent-primary)] border-b-2 border-[var(--accent-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-primary)]">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse-glow" />
          <span className="text-xs font-medium text-[var(--text-secondary)]">Markets Open</span>
        </div>
        <span className="hidden sm:block text-xs text-[var(--text-muted)]">Last updated: {time || '--:--:-- UTC'}</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="p-2.5 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-elevated)] transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent-primary)] border-2 border-[var(--bg-primary)]" />
          </button>
          <Link
            href="/deployment"
            className="px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-[var(--bg-primary)] font-semibold text-sm hover:opacity-90 transition-opacity shadow-md"
          >
            Launch Platform
          </Link>
        </div>
      </div>
    </header>
  );
}
