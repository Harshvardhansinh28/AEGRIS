/* ======================================
   API BASE URL
====================================== */

const getBaseUrl = (): string => {
  if (typeof window === 'undefined') {
    // During SSR build
    return process.env.NEXT_PUBLIC_API_BASE_URL || '';
  }

  return (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    'http://127.0.0.1:8000'
  );
};

export const API_BASE_URL = getBaseUrl();

/* ======================================
   GENERIC FETCH HELPER
====================================== */

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${endpoint}`);
  }

  return res.json();
}

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

export interface ChatResponse {
  reply: string;
  sources: string[];
}

/* ======================================
   SIMULATION
====================================== */

export function getBackendHealth(): Promise<BackendHealth> {
  return apiFetch('/api/simulation/health');
}

export function startSimulation(): Promise<SimulationState> {
  return apiFetch('/api/simulation/start', {
    method: 'POST',
  });
}

export function stepSimulation(): Promise<SimulationState> {
  return apiFetch('/api/simulation/step', {
    method: 'POST',
  });
}

export function getSimulationState(): Promise<SimulationState> {
  return apiFetch('/api/simulation/state');
}

/* ======================================
   MARKET
====================================== */

export function getMarketSummary(): Promise<MarketSummary> {
  return apiFetch('/api/market/summary');
}

export function getQuote(symbol: string): Promise<MarketQuote> {
  return apiFetch(
    `/api/market/quote/${encodeURIComponent(symbol)}`
  );
}

/* ======================================
   CHAT
====================================== */

export function sendChatMessage(
  message: string
): Promise<ChatResponse> {
  return apiFetch('/api/chat/message', {
    method: 'POST',
    body: JSON.stringify({ message }),
  });
}
