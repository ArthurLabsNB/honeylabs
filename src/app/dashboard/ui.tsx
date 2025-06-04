"use client";
import { createContext, useContext, useState } from "react";



interface UIState {
  fullscreen: boolean;
  toggleFullscreen: () => void;
  sidebarGlobalVisible: boolean;
  sidebarGlobalCollapsed: boolean;
  toggleSidebarCollapsed: () => void;
}

const DashboardUIContext = createContext<UIState>({
  fullscreen: false,
  toggleFullscreen: () => {},
  sidebarGlobalVisible: true,
  sidebarGlobalCollapsed: false,
  toggleSidebarCollapsed: () => {},
});

export function DashboardUIProvider({ children }: { children: React.ReactNode }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [sidebarGlobalCollapsed, setSidebarGlobalCollapsed] = useState(false);
  const [sidebarGlobalVisible, setSidebarGlobalVisible] = useState(true);

  const toggleFullscreen = () => setFullscreen((f) => !f);
  const toggleSidebarCollapsed = () =>
    setSidebarGlobalCollapsed((c) => !c);

  return (
    <DashboardUIContext.Provider
      value={{
        fullscreen,
        toggleFullscreen,
        sidebarGlobalVisible,
        sidebarGlobalCollapsed,
        toggleSidebarCollapsed,
      }}
    >
      {children}
    </DashboardUIContext.Provider>
  );
}

export function useDashboardUI() {
  return useContext(DashboardUIContext);
}
