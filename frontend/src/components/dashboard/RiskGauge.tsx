'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';

interface RiskGaugeProps {
  value?: number; // 0–100
  label?: string;
  cvar?: number;
  maxDrawdown?: number;
}

export default function RiskGauge({ value = 28, label = 'Risk Score', cvar = 2.4, maxDrawdown = -4.2 }: RiskGaugeProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 h-full flex flex-col overflow-hidden hover:border-[var(--border-elevated)] transition-all group"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="p-2 bg-[var(--bg-elevated)] rounded-xl border border-[var(--border-primary)]"
          >
            <ShieldAlert size={20} className="text-[var(--accent-warning)]" />
          </motion.div>
          <span className="text-sm font-semibold text-[var(--text-secondary)]">{label}</span>
        </div>
        <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-[var(--accent-success)]/10 text-[var(--accent-success)]">
          CVaR OK
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center gap-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--bg-elevated)"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#riskGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="riskGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent-success)" />
                <stop offset="50%" stopColor="var(--accent-warning)" />
                <stop offset="100%" stopColor="var(--accent-danger)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={value}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold text-[var(--text-primary)]"
            >
              {value}
            </motion.span>
          </div>
        </div>
        <div className="space-y-3 flex-1">
          <div className="flex justify-between text-xs">
            <span className="text-[var(--text-muted)]">CVaR (95%)</span>
            <span className="font-semibold text-[var(--text-primary)]">{cvar}%</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-[var(--text-muted)]">Max DD</span>
            <span className="font-semibold text-[var(--accent-danger)]">{maxDrawdown}%</span>
          </div>
          <motion.div
            className="h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-[var(--accent-success)] to-[var(--accent-warning)]"
              initial={{ width: 0 }}
              animate={{ width: `${value}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
