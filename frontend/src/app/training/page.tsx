'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Cpu, CheckCircle } from 'lucide-react';
import { getBackendHealth } from '@/lib/api';

export default function TrainingPage() {
  const [health, setHealth] = useState<{ model_loaded: boolean; status: string } | null>(null);
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
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">AI Training Gym</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">RL model status and training pipeline</p>
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--bg-elevated)] rounded-lg">
              <BrainCircuit size={22} className="text-[var(--accent-primary)]" />
            </div>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">SAC Model</span>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            {loading ? 'Checking…' : health?.model_loaded ? 'Loaded' : 'Not loaded'}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            {health?.model_loaded ? 'Model is ready for simulation from Dashboard.' : 'Run training (scripts/train_agent.py) and restart backend to load model.'}
          </p>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[var(--bg-elevated)] rounded-lg">
              <Cpu size={22} className="text-[var(--accent-primary)]" />
            </div>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">Backend</span>
          </div>
          <p className="text-lg font-semibold text-[var(--text-primary)] flex items-center gap-2">
            {loading ? '…' : health?.status === 'ok' ? (
              <>
                <CheckCircle size={20} className="text-[var(--accent-success)]" />
                Operational
              </>
            ) : (
              'Unavailable'
            )}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Training is run via <code className="bg-[var(--bg-elevated)] px-1 rounded">python scripts/train_agent.py</code> from project root.
          </p>
        </div>
      </motion.div>

      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)] mb-3">Pipeline</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-[var(--text-primary)]">
          <li>Download data: <code className="bg-[var(--bg-elevated)] px-1 rounded">python scripts/download_data.py</code></li>
          <li>Build features: <code className="bg-[var(--bg-elevated)] px-1 rounded">python scripts/build_features.py</code></li>
          <li>Train agent: <code className="bg-[var(--bg-elevated)] px-1 rounded">python scripts/train_agent.py</code></li>
          <li>Restart backend to load the new model</li>
        </ol>
      </div>
    </div>
  );
}
