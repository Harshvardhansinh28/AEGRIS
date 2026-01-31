'use client';

import React from 'react';
import { motion } from 'framer-motion';

const assets = ['SPY', 'QQQ', 'AAPL', 'GLD', 'TLT'];
const matrix = [
  [1, 0.82, 0.71, 0.35, -0.2],
  [0.82, 1, 0.68, 0.28, -0.15],
  [0.71, 0.68, 1, 0.22, -0.1],
  [0.35, 0.28, 0.22, 1, 0.05],
  [-0.2, -0.15, -0.1, 0.05, 1],
];

function getColor(v: number) {
  if (v >= 0.7) return 'var(--accent-primary)';
  if (v >= 0.3) return 'var(--accent-violet)';
  if (v >= 0) return 'var(--accent-success)';
  return 'var(--accent-danger)';
}

function getOpacity(v: number) {
  return 0.3 + Math.abs(v) * 0.7;
}

export default function CorrelationHeatmapWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35 }}
      className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 hover:border-[var(--border-elevated)] transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Correlation Matrix</span>
        <span className="text-xs text-[var(--text-muted)]">Rolling 30d</span>
      </div>
      <div className="overflow-x-auto">
        <div className="inline-grid gap-1 min-w-[200px]" style={{ gridTemplateColumns: `auto repeat(${assets.length}, 1fr)` }}>
          <div />
          {assets.map((a, i) => (
            <motion.span
              key={a}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="text-xs font-medium text-[var(--text-muted)] text-center py-1"
            >
              {a}
            </motion.span>
          ))}
          {assets.map((_, row) => (
            <React.Fragment key={row}>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: row * 0.05 }}
                className="text-xs font-medium text-[var(--text-muted)] flex items-center"
              >
                {assets[row]}
              </motion.span>
              {assets.map((_, col) => (
                <motion.div
                  key={`${row}-${col}`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium"
                  style={{
                    background: getColor(matrix[row][col]),
                    opacity: getOpacity(matrix[row][col]),
                    color: 'var(--text-primary)',
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: (row * assets.length + col) * 0.02 }}
                >
                  {matrix[row][col].toFixed(2)}
                </motion.div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
