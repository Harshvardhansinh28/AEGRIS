'use client';

import { motion } from 'framer-motion';
import {
  Wallet,
  Activity,
  TrendingUp,
  DollarSign,
  Play,
  Square,
} from 'lucide-react';

import MetricWidget from '@/components/dashboard/MetricWidget';
import AllocationChart from '@/components/dashboard/AllocationChart';
import RegimeIndicator from '@/components/dashboard/RegimeIndicator';
import RiskGauge from '@/components/dashboard/RiskGauge';
import DriftScoreWidget from '@/components/dashboard/DriftScoreWidget';
import ModelHealthWidget from '@/components/dashboard/ModelHealthWidget';
import RecentTradesWidget from '@/components/dashboard/RecentTradesWidget';
import ExplainabilityWidget from '@/components/dashboard/ExplainabilityWidget';
import CorrelationHeatmapWidget from '@/components/dashboard/CorrelationHeatmapWidget';
import RealMarketSummary from '@/components/dashboard/RealMarketSummary';

import { useData } from '@/providers/DataProvider';

/* ===================== ANIMATION ===================== */

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ===================== PAGE ===================== */

export default function Dashboard() {
  const {
    simulation,
    history,
    market,
    isRunning,
    start,
    stop,
  } = useData();

  const portfolioValue = simulation?.portfolio_value ?? 1_000_000;
  const totalReturn =
    ((portfolioValue - 1_000_000) / 1_000_000) * 100;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="px-8 py-6 space-y-8"
    >
      {/* HEADER */}
      <motion.div
        variants={item}
        className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Real-time portfolio monitoring and AI-driven insights
        </p>
      </motion.div>

      {/* MARKET SUMMARY */}
      <motion.div variants={item}>
        <RealMarketSummary />
      </motion.div>

      {/* AGENT CONTROL */}
      <motion.div
        variants={item}
        className="flex justify-between items-center bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-5"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm">
            Agent Status:{' '}
            <b className={isRunning ? 'text-green-400' : 'text-gray-400'}>
              {isRunning ? 'Active' : 'Standby'}
            </b>
          </span>
          <RegimeIndicator />
        </div>

        {!isRunning ? (
          <button
            onClick={start}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--accent-primary)] text-black font-semibold"
          >
            <Play size={16} /> Start
          </button>
        ) : (
          <button
            onClick={stop}
            className="flex items-center gap-2 px-5 py-2 rounded-lg border"
          >
            <Square size={16} /> Stop
          </button>
        )}
      </motion.div>

      {/* METRICS */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricWidget
          title="S&P 500"
          value={
            market?.sp500
              ? market.sp500.price.toFixed(2)
              : '—'
          }
          change={market?.sp500?.changePercent ?? 0}
          icon={TrendingUp}
        />

        <MetricWidget
          title="NASDAQ"
          value={
            market?.indices?.[1]
              ? market.indices[1].price.toFixed(2)
              : '—'
          }
          change={market?.indices?.[1]?.changePercent ?? 0}
          icon={Activity}
        />

        <MetricWidget
          title="Portfolio"
          value={`$${portfolioValue.toLocaleString()}`}
          change={totalReturn}
          icon={Wallet}
        />

        <MetricWidget
          title="Top Gainer"
          value={
            market?.gainers?.[0]
              ? market.gainers[0].price.toFixed(2)
              : '—'
          }
          change={market?.gainers?.[0]?.changePercent ?? 0}
          icon={DollarSign}
        />
      </motion.div>

      {/* CHARTS */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2 bg-[var(--bg-card)] border rounded-xl p-6 h-[420px]">
          <CorrelationHeatmapWidget />
        </div>

        <div className="flex flex-col gap-6">
          <AllocationChart weights={simulation?.weights} />
          <RiskGauge value={28} cvar={2.4} maxDrawdown={-4.2} />
        </div>
      </motion.div>

      {/* ANALYTICS */}
      <motion.div
        variants={item}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6"
      >
        <DriftScoreWidget
          featureDrift={0.12}
          rewardDrift={0.08}
          status="normal"
        />
        <ModelHealthWidget />
        <RecentTradesWidget />
        <ExplainabilityWidget />
        <CorrelationHeatmapWidget />
      </motion.div>
    </motion.div>
  );
}
