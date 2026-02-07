'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function TopBar() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Real-time portfolio monitoring
        </p>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <button className="p-2 rounded-lg border border-[var(--border-primary)]">
          <Bell size={18} />
        </button>
        <Link
          href="/deployment"
          className="px-4 py-2 rounded-lg bg-[var(--accent-primary)] text-black font-semibold"
        >
          Launch Platform
        </Link>
      </div>
    </div>
  );
}

