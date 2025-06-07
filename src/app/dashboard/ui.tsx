"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface UIState {
  fullscreen: boolean;
  toggleFullscreen: () => void;
  setFullscreen: (v: boolean) => void;
  sidebarGlobalVisible: boolean;
  sidebarGlobalCollapsed: boolean;
  toggleSidebarVisible: (v?: boolean) => void;
  toggleSidebarCollapsed: () => void;
}

const DashboardUIContext = createContext<UIState>({
  fullscreen: false,
  toggleFullscreen: () => {},
  setFullscreen: () => {},
  sidebarGlobalVisible: true,
  sidebarGlobalCollapsed: false,
  toggleSidebarVisible: () => {},
  toggleSidebarCollapsed: () => {},
});

export function DashboardUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [sidebarGlobalCollapsed, setSidebarGlobalCollapsed] = useState(false);
  const [sidebarGlobalVisible, setSidebarGlobalVisible] = useState(true);

  useEffect(() => {
    if (window.innerWidth < 640) setSidebarGlobalVisible(false);
  }, []);

  const toggleFullscreen = () => setFullscreen((f) => !f);
  const setFullscreenState = (v: boolean) => setFullscreen(v);
  const toggleSidebarCollapsed = () => setSidebarGlobalCollapsed((c) => !c);
  const toggleSidebarVisible = (v?: boolean) =>
    setSidebarGlobalVisible((c) => (typeof v === "boolean" ? v : !c));

  return (
    <DashboardUIContext.Provider
      value={{
        fullscreen,
        toggleFullscreen,
        setFullscreen: setFullscreenState,
        sidebarGlobalVisible,
        sidebarGlobalCollapsed,
        toggleSidebarVisible,
        toggleSidebarCollapsed,
      }}
      data-oid="juman50"
    >
      {children}
    </DashboardUIContext.Provider>
  );
}

export function useDashboardUI() {
  return useContext(DashboardUIContext);
}
