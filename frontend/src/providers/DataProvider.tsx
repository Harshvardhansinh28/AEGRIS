'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  startSimulation,
  stepSimulation,
  getSimulationState,
  getMarketSummary,
  SimulationState,
  MarketSummary,
} from '@/lib/api';

/* =============================
   Types
============================= */

type DataContextType = {
  simulation: SimulationState | null;
  history: SimulationState[];
  market: MarketSummary | null;
  isRunning: boolean;
  start: () => Promise<void>;
  stop: () => void;
};

/* =============================
   Context
============================= */

const DataContext = createContext<DataContextType | undefined>(undefined);

/* =============================
   Provider
============================= */

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [simulation, setSimulation] = useState<SimulationState | null>(null);
  const [history, setHistory] = useState<SimulationState[]>([]);
  const [market, setMarket] = useState<MarketSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  // IMPORTANT: Use browser-safe type
  const simInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ---------- Initial Load ---------- */

  useEffect(() => {
    async function loadInitial() {
      try {
        const sim = await getSimulationState();
        setSimulation(sim);
      } catch (err) {
        console.error('Simulation load failed:', err);
      }

      try {
        const mk = await getMarketSummary();
        setMarket(mk);
      } catch (err) {
        console.error('Market load failed:', err);
      }
    }

    loadInitial();

    const marketTimer = setInterval(async () => {
      try {
        const mk = await getMarketSummary();
        setMarket(mk);
      } catch (err) {
        console.error('Market refresh failed:', err);
      }
    }, 60_000);

    return () => clearInterval(marketTimer);
  }, []);

  /* ---------- Simulation Loop ---------- */

  useEffect(() => {
    if (!isRunning) {
      if (simInterval.current) {
        clearInterval(simInterval.current);
        simInterval.current = null;
      }
      return;
    }

    simInterval.current = setInterval(async () => {
      try {
        const next = await stepSimulation();
        setSimulation(next);
        setHistory((prev) => [...prev, next].slice(-120));

        if (!next.running) {
          setIsRunning(false);
        }
      } catch (err) {
        console.error('Step failed:', err);
        setIsRunning(false);
      }
    }, 250);

    return () => {
      if (simInterval.current) {
        clearInterval(simInterval.current);
        simInterval.current = null;
      }
    };
  }, [isRunning]);

  /* ---------- Actions ---------- */

  const start = async () => {
    try {
      await startSimulation();
      setHistory([]);
      setIsRunning(true);
    } catch (err) {
      console.error('Start failed:', err);
    }
  };

  const stop = () => {
    setIsRunning(false);
  };

  return (
    <DataContext.Provider
      value={{
        simulation,
        history,
        market,
        isRunning,
        start,
        stop,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

/* =============================
   Hook
============================= */

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used inside DataProvider');
  }
  return context;
}
