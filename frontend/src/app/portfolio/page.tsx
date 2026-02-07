
'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useData } from '@/providers/DataProvider';
import type { MarketQuote } from '@/lib/api';

export default function PortfolioPage() {
  const { market } = useData();

  const quotes: MarketQuote[] = market
    ? [...(market.watchlist || []), ...(market.indices || [])]
    : [];

  return (
    <div className="max-w-[1600px] mx-auto space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-[var(--border-primary)]">
        <h1 className="text-2xl font-bold">Portfolio & Watchlist</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Real-time stock and index prices
        </p>
      </div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-primary)] text-left text-[var(--text-muted)]">
                <th className="p-4">Symbol</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Change %</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map((q) => {
                const up = q.changePercent >= 0;
                return (
                  <tr
                    key={q.symbol}
                    className="border-b border-[var(--border-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                  >
                    <td className="p-4 font-medium">{q.symbol}</td>
                    <td className="p-4">
                      ${q.price?.toFixed(2)}
                    </td>
                    <td
                      className={`p-4 text-right font-medium ${
                        up
                          ? 'text-[var(--accent-success)]'
                          : 'text-[var(--accent-danger)]'
                      }`}
                    >
                      {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {up ? '+' : ''}
                      {q.changePercent?.toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
