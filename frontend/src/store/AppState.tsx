'use client';

import React, { createContext, useContext, useState } from 'react';

type AppState = {
  simulation: any;
  setSimulation: (v: any) => void;
};

const AppStateContext = createContext<AppState | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [simulation, setSimulation] = useState(null);

  return (
    <AppStateContext.Provider value={{ simulation, setSimulation }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside provider');
  return ctx;
}
