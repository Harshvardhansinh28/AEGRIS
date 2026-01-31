const getBaseUrl = () =>
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL
    ? process.env.NEXT_PUBLIC_API_BASE_URL
    : 'http://127.0.0.1:8000';

export const API_BASE_URL = getBaseUrl();

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

export async function getBackendHealth(): Promise<BackendHealth> {
  const res = await fetch(`${API_BASE_URL}/api/simulation/health`);
  if (!res.ok) throw new Error('Backend unreachable');
  return res.json();
}

export async function startSimulation(): Promise<SimulationState> {
  const res = await fetch(`${API_BASE_URL}/api/simulation/start`, { method: 'POST' });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to start simulation');
  }
  return res.json();
}

export async function stepSimulation(): Promise<SimulationState> {
  const res = await fetch(`${API_BASE_URL}/api/simulation/step`, { method: 'POST' });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || 'Failed to step simulation');
  }
  const data = await res.json();
  return data as SimulationState;
}

export async function getSimulationState(): Promise<SimulationState> {
  const res = await fetch(`${API_BASE_URL}/api/simulation/state`);
  if (!res.ok) throw new Error('Failed to get state');
  return res.json();
}

export async function getSimulationHistory(): Promise<SimulationState[]> {
  const res = await fetch(`${API_BASE_URL}/api/simulation/history`);
  if (!res.ok) throw new Error('Failed to get history');
  return res.json();
}

// ----- Market (real-time) -----
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

export async function getMarketSummary(): Promise<MarketSummary> {
  const res = await fetch(`${API_BASE_URL}/api/market/summary`);
  if (!res.ok) throw new Error('Failed to fetch market summary');
  return res.json();
}

export async function getQuote(symbol: string): Promise<MarketQuote> {
  const res = await fetch(`${API_BASE_URL}/api/market/quote/${encodeURIComponent(symbol)}`);
  if (!res.ok) throw new Error(`Failed to fetch quote for ${symbol}`);
  return res.json();
}

export async function getQuotes(symbols: string[]): Promise<MarketQuote[]> {
  if (symbols.length === 0) return [];
  const res = await fetch(`${API_BASE_URL}/api/market/quotes?symbols=${symbols.join(',')}`);
  if (!res.ok) throw new Error('Failed to fetch quotes');
  return res.json();
}

// ----- Chat -----
export interface ChatResponse {
  reply: string;
  sources: string[];
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const res = await fetch(`${API_BASE_URL}/api/chat/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  });
  if (!res.ok) throw new Error('Chat request failed');
  return res.json();
}
