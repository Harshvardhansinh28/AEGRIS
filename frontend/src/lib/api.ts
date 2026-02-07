// ===============================
// API BASE URL
// ===============================

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// Helper for fetch with better error handling
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    cache: "no-store", // always fresh data
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      errorText || `Request failed: ${res.status} ${res.statusText}`
    );
  }

  return res.json();
}

// ===============================
// SIMULATION TYPES
// ===============================

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

// ===============================
// SIMULATION API
// ===============================

export const getBackendHealth = () =>
  apiFetch<BackendHealth>("/api/simulation/health");

export const startSimulation = () =>
  apiFetch<SimulationState>("/api/simulation/start", {
    method: "POST",
  });

export const stepSimulation = () =>
  apiFetch<SimulationState>("/api/simulation/step", {
    method: "POST",
  });

export const getSimulationState = () =>
  apiFetch<SimulationState>("/api/simulation/state");

export const getSimulationHistory = () =>
  apiFetch<SimulationState[]>("/api/simulation/history");

// ===============================
// MARKET TYPES
// ===============================

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

// ===============================
// MARKET API
// ===============================

export const getMarketSummary = () =>
  apiFetch<MarketSummary>("/api/market/summary");

export const getQuote = (symbol: string) =>
  apiFetch<MarketQuote>(
    `/api/market/quote/${encodeURIComponent(symbol)}`
  );

export const getQuotes = (symbols: string[]) => {
  if (!symbols.length) return Promise.resolve([]);
  return apiFetch<MarketQuote[]>(
    `/api/market/quotes?symbols=${symbols.join(",")}`
  );
};

// ===============================
// CHAT TYPES
// ===============================

export interface ChatResponse {
  reply: string;
  sources: string[];
}

// ===============================
// CHAT API
// ===============================

export const sendChatMessage = (message: string) =>
  apiFetch<ChatResponse>("/api/chat/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
