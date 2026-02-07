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
  type SimulationState,
  type MarketSummary,
} from '@/lib/api';

type DataContextType = {
  simulation: SimulationState | null;
  history: SimulationState[];
  market: MarketSummary | null;
  isRunning: boolean;
  start: () => Promise<void>;
  stop: () => void;
};

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [simulation, setSimulation] = useState<SimulationState | null>(null);
  const [history, setHistory] = useState<SimulationState[]>([]);
  const [market, setMarket] = useState<MarketSummary | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const simInterval = useRef<NodeJS.Timeout | null>(null);

  /* -------- INITIAL LOAD -------- */
  useEffect(() => {
    getSimulationState().then(setSimulation).catch(console.error);
    getMarketSummary().then(setMarket).catch(console.error);

    const marketTimer = setInterval(() => {
      getMarketSummary().then(setMarket).catch(console.error);
    }, 60_000);

    return () => clearInterval(marketTimer);
  }, []);

  /* -------- SIMULATION LOOP -------- */
  useEffect(() => {
    if (!isRunning) {
      if (simInterval.current) clearInterval(simInterval.current);
      return;
    }

    simInterval.current = setInterval(async () => {
      try {
        const next = await stepSimulation();
        setSimulation(next);
        setHistory((h) => [...h, next].slice(-120));
        if (!next.running) setIsRunning(false);
      } catch (e) {
        console.error(e);
        setIsRunning(false);
      }
    }, 250);

    return () => {
      if (simInterval.current) clearInterval(simInterval.current);
    };
  }, [isRunning]);

  /* -------- ACTIONS -------- */
  const start = async () => {
    await startSimulation();
    setHistory([]);
    setIsRunning(true);
  };

  const stop = () => setIsRunning(false);

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

/* -------- SAFE HOOK -------- */
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used inside DataProvider');
  return ctx;
}
