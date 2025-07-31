"use client";
import { createContext, useContext } from 'react';
import usePanel, { type Panel } from '@/hooks/usePanel';

interface PanelData extends ReturnType<typeof usePanel> {}

const PanelDataContext = createContext<PanelData | null>(null);

export function PanelDataProvider({ panelId, children }: { panelId?: string | null; children: React.ReactNode }) {
  const value = usePanel(panelId);
  return <PanelDataContext.Provider value={value}>{children}</PanelDataContext.Provider>;
}

export function usePanelData() {
  const ctx = useContext(PanelDataContext);
  if (!ctx) throw new Error('usePanelData must be used within PanelDataProvider');
  return ctx;
}
