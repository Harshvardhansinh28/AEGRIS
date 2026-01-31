'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const trades = [
  { asset: 'SPY', side: 'BUY', qty: 10, price: 452.3, pnl: null },
  { asset: 'QQQ', side: 'SELL', qty: 5, price: 398.1, pnl: 124.5 },
  { asset: 'AAPL', side: 'BUY', qty: 20, price: 189.2, pnl: null },
  { asset: 'GLD', side: 'SELL', qty: 15, price: 198.4, pnl: -32.1 },
  { asset: 'TLT', side: 'BUY', qty: 8, price: 94.2, pnl: null },
];

export default function RecentTradesWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 h-full flex flex-col overflow-hidden hover:border-[var(--border-elevated)] transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-[var(--text-secondary)]">Recent Trades</span>
        <span className="text-xs text-[var(--text-muted)]">Live</span>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto min-h-0">
        {trades.map((t, i) => (
          <motion.div
            key={`${t.asset}-${i}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-[var(--bg-elevated)] transition-colors border border-transparent hover:border-[var(--border-primary)]"
          >
            <div className="flex items-center gap-2">
              {t.side === 'BUY' ? (
                <ArrowUpRight size={14} className="text-[var(--accent-success)]" />
              ) : (
                <ArrowDownRight size={14} className="text-[var(--accent-danger)]" />
              )}
              <span className="font-medium text-sm text-[var(--text-primary)]">{t.asset}</span>
              <span className={`text-xs ${t.side === 'BUY' ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'}`}>
                {t.side}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[var(--text-primary)]">{t.qty} @ ${t.price}</span>
              {t.pnl != null && (
                <span className={`block text-xs font-medium ${t.pnl >= 0 ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'}`}>
                  {t.pnl >= 0 ? '+' : ''}{t.pnl.toFixed(2)}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
