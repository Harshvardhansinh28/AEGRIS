'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, CheckCircle, AlertCircle } from 'lucide-react';

const checks = [
  { label: 'Latency', value: '12ms', ok: true },
  { label: 'Throughput', value: '1.2k/s', ok: true },
  { label: 'Accuracy', value: '98.4%', ok: true },
  { label: 'Drift', value: 'Low', ok: true },
];

export default function ModelHealthWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 hover:border-[var(--border-elevated)] transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            className="p-2 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)]"
            whileHover={{ rotate: 10 }}
          >
            <Cpu size={18} className="text-[var(--accent-primary)]" />
          </motion.div>
          <span className="text-sm font-semibold text-[var(--text-secondary)]">Model Health</span>
        </div>
        <motion.div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--accent-success)]/10 text-[var(--accent-success)]"
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <CheckCircle size={14} />
          <span className="text-xs font-semibold">HEALTHY</span>
        </motion.div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {checks.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between py-2 px-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-primary)]"
          >
            <span className="text-xs text-[var(--text-muted)]">{c.label}</span>
            <span className="text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1">
              {c.value}
              {c.ok ? (
                <CheckCircle size={12} className="text-[var(--accent-success)]" />
              ) : (
                <AlertCircle size={12} className="text-[var(--accent-warning)]" />
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
