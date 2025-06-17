"use client";
import { createContext, useContext, useState } from "react";

interface Ops {
  guardar: () => void;
  setGuardar: (fn: () => void) => void;
}

const PanelOpsContext = createContext<Ops>({
  guardar: () => {},
  setGuardar: () => {},
});

export function PanelOpsProvider({ children }: { children: React.ReactNode }) {
  const [guardarFn, setGuardarFn] = useState<() => void>(() => {});
  return (
    <PanelOpsContext.Provider value={{ guardar: guardarFn, setGuardar: setGuardarFn }}>
      {children}
    </PanelOpsContext.Provider>
  );
}

export function usePanelOps() {
  return useContext(PanelOpsContext);
}
