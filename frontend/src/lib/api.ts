/* ======================================
   API BASE URL
====================================== */

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://127.0.0.1:8000';

export const API_BASE_URL = getBaseUrl();

/* ======================================
   TYPES
====================================== */

export interface SimulationState {
  step: number;
  portfolio_value: number;
  drawdown: number;
  volatility: number;
  turnover: number;
  weights: number[];
  running?: boolean;
}

export interface BackendHealth {
  status: string;
  model_loaded: boolean;
  running: boolean;
}

export interface MarketQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
}

export interface MarketSummary {
  indices: MarketQuote[];
  watchlist: MarketQuote[];
  gainers: MarketQuote[];
  losers: MarketQuote[];
  sp500: MarketQuote | null;
  timestamp: string;
}

/* ======================================
   SIMULATION
====================================== */

export async function getBackendHealth(): Promise<BackendHealth> {
  const res = await fetch(`${API_BASE_URL}/api/simulation/health`);
  if (!res.ok) throw new Error('Backend unreachable');
  return res.json();
}

export async function startSimulation(): Promise<SimulationState> {
  const res = await fetch(`${API_BASE_URL}/api/simulation/start`, {
    method: 'POST',
  });

  if (!res.ok) throw new Error('Failed to start simulation');

  return res.json();
}

export async function stepSimulation(): Promise<SimulationState> {
  const res = await fetch(`${API_BASE_URL}/api/simulation/step`, {
    method: 'POST',
  });

  if (!res.ok) throw new Error('Failed to step simulation');

  return res.json();
}

export async function getSimulationState(): Promise<SimulationState> {
  const res = await fetch(`${API_BASE_URL}/api/simulation/state`);
  if (!res.ok) throw new Error('Failed to get simulation state');
  return res.json();
}

/* ======================================
   MARKET
====================================== */

export async function getMarketSummary(): Promise<MarketSummary> {
  const res = await fetch(`${API_BASE_URL}/api/market/summary`);
  if (!res.ok) throw new Error('Failed to fetch market summary');
  return res.json();
}

export async function getQuote(symbol: string): Promise<MarketQuote> {
  const res = await fetch(
    `${API_BASE_URL}/api/market/quote/${encodeURIComponent(symbol)}`
  );

  if (!res.ok) throw new Error('Failed to fetch quote');

  return res.json();
}

