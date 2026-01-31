'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, TrendingDown, Activity } from 'lucide-react';
import { getMarketSummary, type MarketSummary } from '@/lib/api';

export default function RiskPage() {
  const [data, setData] = useState<MarketSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const summary = await getMarketSummary();
        if (!cancelled) setData(summary);
      } catch {
        if (!cancelled) setData(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const losers = data?.losers ?? [];
  const volatilityProxy = data?.indices?.length
    ? Math.abs(data.indices.reduce((a, i) => a + (i.changePercent || 0), 0) / data.indices.length)
    : 0;

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="pb-6 border-b border-[var(--border-primary)]">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Risk & Exposure</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">Market risk indicators and notable decliners</p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 h-32 animate-pulse" />
          ))}
        </div>
      )}

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--bg-elevated)] rounded-lg">
                <ShieldAlert size={22} className="text-[var(--accent-warning)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--text-secondary)]">Market Stress</span>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {data?.losers?.length ? 'Moderate' : 'Low'}
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Based on current decliners</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--bg-elevated)] rounded-lg">
                <Activity size={22} className="text-[var(--accent-primary)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--text-secondary)]">Index Volatility (proxy)</span>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{volatilityProxy.toFixed(2)}%</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Avg absolute index move</p>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--bg-elevated)] rounded-lg">
                <TrendingDown size={22} className="text-[var(--accent-danger)]" />
              </div>
              <span className="text-sm font-semibold text-[var(--text-secondary)]">Notable Decliners</span>
            </div>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{losers.length}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">From watchlist</p>
          </div>
        </motion.div>
      )}

      {!loading && losers.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl overflow-hidden">
          <h2 className="p-4 text-sm font-semibold text-[var(--text-secondary)] border-b border-[var(--border-primary)]">
            Current decliners (real-time)
          </h2>
          <ul className="divide-y divide-[var(--border-primary)]">
            {losers.map((q) => (
              <li key={q.symbol} className="flex justify-between items-center p-4 hover:bg-[var(--bg-elevated)]">
                <span className="font-medium text-[var(--text-primary)]">{q.symbol}</span>
                <span className="text-[var(--accent-danger)] font-semibold">{q.changePercent?.toFixed(2)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
