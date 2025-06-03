"use client";
import { createContext, useContext, useState } from "react";

interface UIState {
  fullscreen: boolean;
  toggleFullscreen: () => void;
}

const DashboardUIContext = createContext<UIState>({
  fullscreen: false,
  toggleFullscreen: () => {},
});

export function DashboardUIProvider({ children }: { children: React.ReactNode }) {
  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => setFullscreen((f) => !f);
  return (
    <DashboardUIContext.Provider value={{ fullscreen, toggleFullscreen }}>
      {children}
    </DashboardUIContext.Provider>
  );
}

export function useDashboardUI() {
  return useContext(DashboardUIContext);
}
