"use client";
import { createContext, useContext, useState } from "react";

interface State {
  collapsed: boolean;
  toggleCollapsed: () => void;
}

const Context = createContext<State>({
  collapsed: false,
  toggleCollapsed: () => {},
});

export function DetalleUIProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleCollapsed = () => setCollapsed((v) => !v);
  return (
    <Context.Provider value={{ collapsed, toggleCollapsed }}>
      {children}
    </Context.Provider>
  );
}

export function useDetalleUI() {
  return useContext(Context);
}
