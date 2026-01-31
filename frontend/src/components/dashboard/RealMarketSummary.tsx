'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { getMarketSummary, type MarketSummary, type MarketQuote } from '@/lib/api';

function QuoteCard({ q, label }: { q: MarketQuote; label?: string }) {
  const up = q.changePercent >= 0;
  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-4 flex flex-col gap-1">
      {label && <span className="text-xs text-[var(--text-muted)]">{label}</span>}
      <span className="text-sm font-medium text-[var(--text-secondary)]">{q.symbol}</span>
      <span className="text-xl font-bold text-[var(--accent-primary)]">
        ${typeof q.price === 'number' ? q.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : q.price}
      </span>
      <span className={`text-xs font-semibold flex items-center gap-0.5 ${up ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'}`}>
        {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
        {up ? '+' : ''}{q.changePercent.toFixed(2)}%
      </span>
    </div>
  );
}

export default function RealMarketSummary() {
  const [data, setData] = useState<MarketSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await getMarketSummary();
      setData(summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load market data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    const t = setInterval(fetchSummary, 60_000);
    return () => clearInterval(t);
  }, []);

  if (loading && !data) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-4 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 text-center">
        <p className="text-[var(--text-secondary)] text-sm">{error}</p>
        <button
          type="button"
          onClick={fetchSummary}
          className="mt-2 text-sm text-[var(--accent-primary)] hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const indices = data.indices?.length ? data.indices : (data.sp500 ? [data.sp500] : []);
  const watchlist = data.watchlist?.slice(0, 4) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Live markets</h2>
        <button
          type="button"
          onClick={fetchSummary}
          disabled={loading}
          className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {indices.slice(0, 4).map((q) => (
          <QuoteCard key={q.symbol} q={q} label="Index" />
        ))}
      </div>
      {watchlist.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-[var(--text-secondary)]">Watchlist</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {watchlist.map((q) => (
              <QuoteCard key={q.symbol} q={q} />
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
}
