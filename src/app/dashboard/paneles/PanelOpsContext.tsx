"use client";
import { createContext, useContext, useState } from "react";

interface Ops {
  guardar: () => void;
  setGuardar: (fn: () => void) => void;
  mostrarHistorial: () => void;
  setMostrarHistorial: (fn: () => void) => void;
}

const PanelOpsContext = createContext<Ops>({
  guardar: () => {},
  setGuardar: () => {},
  mostrarHistorial: () => {},
  setMostrarHistorial: () => {},
});

export function PanelOpsProvider({ children }: { children: React.ReactNode }) {
  const [guardarFn, setGuardarFn] = useState<() => void>(() => {});
  const [mostrarFn, setMostrarFn] = useState<() => void>(() => {});
  return (
    <PanelOpsContext.Provider value={{ guardar: guardarFn, setGuardar: setGuardarFn, mostrarHistorial: mostrarFn, setMostrarHistorial: setMostrarFn }}>
      {children}
    </PanelOpsContext.Provider>
  );
}

export function usePanelOps() {
  return useContext(PanelOpsContext);
}
