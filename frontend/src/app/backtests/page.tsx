'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const backtests = [
  {
    name: 'Momentum Alpha v2',
    roi: 38.4,
    drawdown: -6.2,
    winRate: 61,
    status: 'Completed',
  },
  {
    name: 'Mean Reversion X',
    roi: 21.7,
    drawdown: -4.8,
    winRate: 58,
    status: 'Completed',
  },
  {
    name: 'RL Adaptive Agent',
    roi: -3.4,
    drawdown: -9.1,
    winRate: 44,
    status: 'Failed',
  },
];

export default function BacktestsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Backtests</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Historical strategy performance analysis
        </p>
      </div>

      <div className="grid gap-4">
        {backtests.map((b, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-5 flex justify-between"
          >
            <div>
              <p className="font-semibold">{b.name}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                Win Rate: {b.winRate}%
              </p>
            </div>

            <div className="text-right">
              <p
                className={`flex items-center gap-1 font-bold ${
                  b.roi >= 0 ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {b.roi >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                ROI: {b.roi}%
              </p>
              <p className="text-xs">DD: {b.drawdown}%</p>
              <p className="text-xs text-[var(--text-secondary)]">
                Status: {b.status}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}


