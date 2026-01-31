'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, CheckCircle, Server } from 'lucide-react';
import { getBackendHealth } from '@/lib/api';

export default function DeploymentPage() {
  const [health, setHealth] = useState<{ model_loaded: boolean; status: string; running?: boolean } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getBackendHealth()
      .then((h) => { if (!cancelled) setHealth(h); })
      .catch(() => { if (!cancelled) setHealth(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="pb-6 border-b border-[var(--border-primary)]">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Deployment</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">Model and API status</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--bg-elevated)] rounded-lg">
              <Server size={22} className="text-[var(--accent-primary)]" />
            </div>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">API</span>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            {loading ? '…' : health?.status === 'ok' ? (
              <>
                <CheckCircle size={20} className="text-[var(--accent-success)]" />
                Live
              </>
            ) : (
              'Not reachable'
            )}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">Backend must be running for simulation and market data.</p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--bg-elevated)] rounded-lg">
              <Rocket size={22} className="text-[var(--accent-primary)]" />
            </div>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Model</span>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            {loading ? '…' : health?.model_loaded ? 'Deployed' : 'Not deployed'}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {health?.model_loaded ? 'SAC model loaded from models/checkpoints/.' : 'Train and restart backend to deploy.'}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
