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
  toolsSidebarVisible: boolean;
  toggleToolsSidebar: (v?: boolean) => void;
}

const DashboardUIContext = createContext<UIState>({
  fullscreen: false,
  toggleFullscreen: () => {},
  setFullscreen: () => {},
  sidebarGlobalVisible: true,
  sidebarGlobalCollapsed: false,
  toggleSidebarVisible: () => {},
  toggleSidebarCollapsed: () => {},
  toolsSidebarVisible: false,
  toggleToolsSidebar: () => {},
});

export function DashboardUIProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [sidebarGlobalCollapsed, setSidebarGlobalCollapsed] = useState(false);
  const [sidebarGlobalVisible, setSidebarGlobalVisible] = useState(true);
  const [toolsSidebarVisible, setToolsSidebarVisible] = useState(false);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSidebarGlobalVisible(false);
        setSidebarGlobalCollapsed(false);
      } else if (width < 1024) {
        setSidebarGlobalVisible(true);
        setSidebarGlobalCollapsed(true);
      } else {
        setSidebarGlobalVisible(true);
        setSidebarGlobalCollapsed(false);
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const toggleFullscreen = () => setFullscreen((f) => !f);
  const setFullscreenState = (v: boolean) => setFullscreen(v);
  const toggleSidebarCollapsed = () => setSidebarGlobalCollapsed((c) => !c);
  const toggleSidebarVisible = (v?: boolean) =>
    setSidebarGlobalVisible((c) => (typeof v === "boolean" ? v : !c));
  const toggleToolsSidebar = (v?: boolean) =>
    setToolsSidebarVisible((c) => (typeof v === "boolean" ? v : !c));

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
        toolsSidebarVisible,
        toggleToolsSidebar,
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
