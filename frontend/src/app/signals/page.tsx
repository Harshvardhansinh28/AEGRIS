'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const signals = [
  {
    symbol: 'AAPL',
    action: 'BUY',
    confidence: 82,
    timeframe: '15m',
    price: 187.42,
  },
  {
    symbol: 'BTC-USD',
    action: 'SELL',
    confidence: 71,
    timeframe: '5m',
    price: 42150,
  },
  {
    symbol: 'NIFTY 50',
    action: 'HOLD',
    confidence: 64,
    timeframe: '1h',
    price: 22104,
  },
];

export default function SignalsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-2xl font-bold">Live Signals</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          AI-generated real-time trading signals
        </p>
      </div>

      <div className="grid gap-4">
        {signals.map((s, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.02 }}
            className="flex justify-between items-center bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-5"
          >
            <div>
              <p className="font-semibold">{s.symbol}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                Timeframe: {s.timeframe}
              </p>
            </div>

            <div className="text-right">
              <div
                className={`flex items-center gap-1 font-bold ${
                  s.action === 'BUY'
                    ? 'text-green-500'
                    : s.action === 'SELL'
                    ? 'text-red-500'
                    : 'text-yellow-500'
                }`}
              >
                {s.action === 'BUY' && <ArrowUpRight size={16} />}
                {s.action === 'SELL' && <ArrowDownRight size={16} />}
                {s.action}
              </div>
              <p className="text-xs">
                Confidence: {s.confidence}%
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Price: {s.price}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
