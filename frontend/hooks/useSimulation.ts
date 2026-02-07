import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export type SimulationState = {
  running: boolean;
  portfolio_value?: number;
  regime?: string;
  risk_score?: number;
  allocations?: Record<string, number>;
};

export function useSimulation() {
  const [state, setState] = useState<SimulationState | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const stateRes = await fetch(`${API}/api/simulation/state`);
      if (!stateRes.ok) throw new Error("State fetch failed");

      const stateJson = await stateRes.json();
      setState(stateJson);

      const historyRes = await fetch(`${API}/api/simulation/history`);
      setHistory(historyRes.ok ? await historyRes.json() : []);

      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return { state, history, loading, error };
}

