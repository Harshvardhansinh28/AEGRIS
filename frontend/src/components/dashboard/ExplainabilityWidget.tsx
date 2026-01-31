'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';

const features = [
  { name: 'Momentum', importance: 0.28, color: 'var(--accent-primary)' },
  { name: 'Volatility', importance: 0.22, color: 'var(--accent-secondary)' },
  { name: 'Volume', importance: 0.18, color: 'var(--accent-violet)' },
  { name: 'Correlation', importance: 0.15, color: 'var(--accent-success)' },
  { name: 'Regime', importance: 0.12, color: 'var(--accent-warning)' },
  { name: 'Other', importance: 0.05, color: 'var(--text-muted)' },
];

export default function ExplainabilityWidget() {
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
            whileHover={{ scale: 1.05 }}
          >
            <BarChart3 size={18} className="text-[var(--accent-primary)]" />
          </motion.div>
          <span className="text-sm font-semibold text-[var(--text-secondary)]">Feature Importance</span>
        </div>
        <span className="text-xs text-[var(--text-muted)]">SHAP</span>
      </div>
      <div className="space-y-3">
        {features.map((f, i) => (
          <div key={f.name}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-[var(--text-muted)]">{f.name}</span>
              <span className="font-medium text-[var(--text-primary)]">{(f.importance * 100).toFixed(0)}%</span>
            </div>
            <motion.div
              className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: f.color }}
                initial={{ width: 0 }}
                animate={{ width: `${f.importance * 100}%` }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.05 }}
              />
            </motion.div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-[var(--text-muted)]">Allocation drivers · Policy sensitivity</p>
    </motion.div>
  );
}
