'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';

interface DriftScoreWidgetProps {
  featureDrift?: number;
  rewardDrift?: number;
  status?: 'normal' | 'warning' | 'critical';
}

export default function DriftScoreWidget({
  featureDrift = 0.12,
  rewardDrift = 0.08,
  status = 'normal',
}: DriftScoreWidgetProps) {
  const statusColor =
    status === 'critical'
      ? 'var(--accent-danger)'
      : status === 'warning'
        ? 'var(--accent-warning)'
        : 'var(--accent-success)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 hover:border-[var(--border-elevated)] transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            className="p-2 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)]"
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity size={18} className="text-[var(--accent-primary)]" />
          </motion.div>
          <span className="text-sm font-semibold text-[var(--text-secondary)]">Drift Detection</span>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-lg"
          style={{
            background: `${statusColor}20`,
            color: statusColor,
          }}
        >
          {status.toUpperCase()}
        </span>
      </div>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Feature drift</span>
            <span className="font-medium text-[var(--text-primary)]">{(featureDrift * 100).toFixed(2)}%</span>
          </div>
          <motion.div
            className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-full rounded-full bg-[var(--accent-primary)]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(featureDrift * 500, 100)}%` }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </motion.div>
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[var(--text-muted)]">Reward drift</span>
            <span className="font-medium text-[var(--text-primary)]">{(rewardDrift * 100).toFixed(2)}%</span>
          </div>
          <motion.div
            className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="h-full rounded-full bg-[var(--accent-secondary)]"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(rewardDrift * 500, 100)}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
            />
          </motion.div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-[var(--border-primary)] flex items-center gap-2 text-xs text-[var(--text-muted)]">
        <TrendingUp size={14} />
        Auto-retrain threshold: 0.25
      </div>
    </motion.div>
  );
}
