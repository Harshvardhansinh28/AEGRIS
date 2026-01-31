'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { getMarketSummary, type MarketSummary, type MarketQuote } from '@/lib/api';

export default function PortfolioPage() {
  const [data, setData] = useState<MarketSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await getMarketSummary();
      setData(summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 60_000);
    return () => clearInterval(t);
  }, []);

  const quotes = data ? [...(data.watchlist || []), ...(data.indices || [])] : [];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-center pb-6 border-b border-[var(--border-primary)]">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Portfolio & Watchlist</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-0.5">Real-time stock and index prices</p>
        </div>
        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-elevated)] transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading && !data && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-8 text-center text-[var(--text-muted)]">
          Loading market data…
        </div>
      )}

      {error && !data && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 text-center">
          <p className="text-[var(--accent-danger)] text-sm">{error}</p>
          <button type="button" onClick={fetchData} className="mt-2 text-sm text-[var(--accent-primary)] hover:underline">
            Retry
          </button>
        </div>
      )}

      {data && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border-primary)] text-left text-[var(--text-muted)]">
                  <th className="p-4 font-semibold">Symbol</th>
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold text-right">Price</th>
                  <th className="p-4 font-semibold text-right">Change</th>
                  <th className="p-4 font-semibold text-right">Change %</th>
                  <th className="p-4 font-semibold text-right">Volume</th>
                </tr>
              </thead>
              <tbody>
                {quotes.map((q: MarketQuote) => {
                  const up = q.changePercent >= 0;
                  return (
                    <tr key={q.symbol} className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="p-4 font-medium text-[var(--text-primary)]">{q.symbol}</td>
                      <td className="p-4 text-[var(--text-secondary)]">{q.name}</td>
                      <td className="p-4 text-right font-semibold text-[var(--accent-primary)]">
                        ${typeof q.price === 'number' ? q.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : q.price}
                      </td>
                      <td className={`p-4 text-right font-medium ${up ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'}`}>
                        {up ? '+' : ''}{q.change?.toFixed(2)}
                      </td>
                      <td className={`p-4 text-right font-medium ${up ? 'text-[var(--accent-success)]' : 'text-[var(--accent-danger)]'}`}>
                        {up ? '+' : ''}{q.changePercent?.toFixed(2)}%
                      </td>
                      <td className="p-4 text-right text-[var(--text-muted)]">
                        {q.volume != null ? (q.volume / 1_000_000).toFixed(2) + 'M' : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
}
