// src/lib/api.ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL as string;

async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    cache: 'no-store',
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`API error: ${err}`);
  }
  return res.json();
}

export const getMarketSummary = () =>
  apiFetch('/api/market/summary');

export const getSimulationState = () =>
  apiFetch('/api/simulation/state');

export const startSimulation = () =>
  apiFetch('/api/simulation/start', { method: 'POST' });

// ... etc
