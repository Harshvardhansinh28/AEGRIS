'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setApiUrl(process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000');
    }
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="pb-6 border-b border-[var(--border-primary)]">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">App preferences</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-xl">
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon size={20} className="text-[var(--accent-primary)]" />
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Appearance</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-primary)]">Theme</span>
            <button
              type="button"
              onClick={toggleTheme}
              className="px-4 py-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-primary)] text-sm font-medium text-[var(--text-primary)] hover:border-[var(--border-elevated)] transition-colors"
            >
              {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <SettingsIcon size={20} className="text-[var(--accent-primary)]" />
            <span className="text-sm font-semibold text-[var(--text-secondary)]">API</span>
          </div>
          <p className="text-sm text-[var(--text-muted)] mb-2">Backend URL (set via NEXT_PUBLIC_API_BASE_URL)</p>
          <p className="text-sm font-mono text-[var(--text-primary)] bg-[var(--bg-elevated)] rounded-lg px-3 py-2">
            {apiUrl || '—'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
