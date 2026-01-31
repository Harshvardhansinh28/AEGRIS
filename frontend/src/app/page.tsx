'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import MetricWidget from '@/components/dashboard/MetricWidget';
import AllocationChart from '@/components/dashboard/AllocationChart';
import RegimeIndicator from '@/components/dashboard/RegimeIndicator';
import RiskGauge from '@/components/dashboard/RiskGauge';
import DriftScoreWidget from '@/components/dashboard/DriftScoreWidget';
import ModelHealthWidget from '@/components/dashboard/ModelHealthWidget';
import RecentTradesWidget from '@/components/dashboard/RecentTradesWidget';
import ExplainabilityWidget from '@/components/dashboard/ExplainabilityWidget';
import CorrelationHeatmapWidget from '@/components/dashboard/CorrelationHeatmapWidget';
import {
  Wallet,
  Activity,
  TrendingUp,
  DollarSign,
  Play,
  Square,
  Zap,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { startSimulation, stepSimulation, getSimulationState, SimulationState, getMarketSummary, type MarketSummary } from '@/lib/api';
import RealMarketSummary from '@/components/dashboard/RealMarketSummary';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

export default function Dashboard() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [history, setHistory] = useState<SimulationState[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMarket = useCallback(async () => {
    try {
      const data = await getMarketSummary();
      setMarketSummary(data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const data = await getSimulationState();
      setState(data);
      setHistory((prev) => {
        if (prev.find((h) => h.step === data.step)) return prev;
        return [...prev, data].slice(-100);
      });
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleStart = async () => {
    try {
      await startSimulation();
      setHistory([]);
      setIsRunning(true);
      fetchData();
    } catch (e) {
      console.error('Failed to start', e);
    }
  };

  const handleStop = () => setIsRunning(false);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(async () => {
        try {
          const newState = await stepSimulation();
          setState(newState);
          setHistory((prev) => [...prev, newState].slice(-50));
          if (newState.running === false) setIsRunning(false);
        } catch (e) {
          console.error(e);
          setIsRunning(false);
        }
      }, 200);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchMarket();
    const t = setInterval(fetchMarket, 60_000);
    return () => clearInterval(t);
  }, [fetchMarket]);

  const portfolioValue = state?.portfolio_value ?? 1_000_000;
  const totalReturn = ((portfolioValue - 1_000_000) / 1_000_000) * 100;
  const dailyPnL =
    history.length > 1
      ? history[history.length - 1].portfolio_value - history[history.length - 2].portfolio_value
      : 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-[1800px] mx-auto space-y-6"
    >
      <motion.div variants={itemVariants} className="mb-2">
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-0.5">Real-time portfolio monitoring and AI-driven insights</p>
      </motion.div>

      {/* Real-time market indices + watchlist */}
      <motion.div variants={itemVariants}>
        <RealMarketSummary />
      </motion.div>

      {/* Agent Control + Regime */}
      <motion.div variants={itemVariants} className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <motion.div
              className={`w-3 h-3 rounded-full ${isRunning ? 'bg-[var(--accent-success)]' : 'bg-[var(--text-muted)]'} animate-pulse`}
              animate={isRunning ? { scale: [1, 1.2, 1], opacity: [1, 0.8, 1] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
            <span className="text-sm font-medium text-[var(--text-secondary)]">
              Agent Status:{' '}
              <span className={isRunning ? 'text-[var(--accent-success)]' : 'text-[var(--text-muted)]'}>
                {isRunning ? 'Active' : 'Standby'}
              </span>
            </span>
          </div>
          <RegimeIndicator />
        </div>
        <div className="flex gap-3">
          {!isRunning ? (
            <motion.button
              onClick={handleStart}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--accent-primary)] rounded-xl font-semibold text-sm text-[var(--bg-primary)] shadow-md hover:opacity-90 transition-opacity"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play size={16} fill="currentColor" /> Start Agent
            </motion.button>
          ) : (
            <motion.button
              onClick={handleStop}
              className="flex items-center gap-2 px-5 py-2.5 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl font-semibold text-sm hover:border-[var(--accent-danger)] hover:text-[var(--accent-danger)] transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Square size={16} fill="currentColor" /> Stop Agent
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Metrics Grid – real market + simulation */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <MetricWidget
          title="S&P 500"
          value={marketSummary?.sp500 != null ? `$${marketSummary.sp500.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          change={marketSummary?.sp500?.changePercent ?? 0}
          icon={TrendingUp}
          trend={marketSummary?.sp500?.changePercent != null ? [50 + Math.min(50, marketSummary.sp500.changePercent * 10), 55, 50, 60, 55, 65, 60, 70] : undefined}
        />
        <MetricWidget
          title={marketSummary?.indices?.[1]?.symbol === '^IXIC' ? 'NASDAQ' : 'Index'}
          value={marketSummary?.indices?.[1] != null ? `$${marketSummary.indices[1].price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
          change={marketSummary?.indices?.[1]?.changePercent ?? 0}
          icon={Activity}
          trend={marketSummary?.indices?.[1]?.changePercent != null ? [40, 50, 55, 50, 60, 65, 70, 75] : undefined}
        />
        <MetricWidget
          title="Portfolio Value (Sim)"
          value={`$${portfolioValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          change={totalReturn}
          icon={Wallet}
          trend={[30, 45, 35, 60, 55, 70, 65, 80]}
        />
        <MetricWidget
          title={marketSummary?.gainers?.[0] ? `Top: ${marketSummary.gainers[0].symbol}` : 'Top Gainer'}
          value={marketSummary?.gainers?.[0] != null ? `$${marketSummary.gainers[0].price.toFixed(2)}` : '—'}
          change={marketSummary?.gainers?.[0]?.changePercent ?? 0}
          icon={DollarSign}
          trend={marketSummary?.gainers?.[0]?.changePercent != null ? [50, 55, 60, 65, 70, 75, 80, 85] : undefined}
        />
      </motion.div>

      {/* Charts + Allocation + Risk */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        <div className="lg:col-span-2">
          <motion.div
            variants={cardVariants}
            className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 h-[450px] flex flex-col"
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">
                  Performance Analytics
                </h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  Real-time portfolio tracking
                </p>
              </div>
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 bg-[var(--accent-success)]/10 rounded-lg"
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Zap size={14} className="text-[var(--accent-success)]" />
                <span className="text-xs font-semibold text-[var(--accent-success)]">LIVE</span>
              </motion.div>
            </div>
            <div className="flex-1 w-full min-h-0" style={{ minHeight: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={
                    history.length > 0
                      ? history
                      : [{ portfolio_value: 1_000_000, step: 0 }]
                  }
                >
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border-primary)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="step"
                    stroke="var(--text-muted)"
                    tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={['auto', 'auto']}
                    stroke="var(--text-muted)"
                    tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-primary)',
                      borderRadius: '12px',
                      color: 'var(--text-primary)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="portfolio_value"
                    stroke="var(--accent-primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <AllocationChart weights={state?.weights} />
          <RiskGauge value={28} cvar={2.4} maxDrawdown={-4.2} />
        </div>
      </motion.div>

      {/* Second row: Drift, Model Health, Trades, Explainability, Correlation */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6"
      >
        <DriftScoreWidget featureDrift={0.12} rewardDrift={0.08} status="normal" />
        <ModelHealthWidget />
        <motion.div variants={cardVariants} className="xl:col-span-1">
          <RecentTradesWidget />
        </motion.div>
        <ExplainabilityWidget />
        <CorrelationHeatmapWidget />
      </motion.div>
    </motion.div>
  );
}
