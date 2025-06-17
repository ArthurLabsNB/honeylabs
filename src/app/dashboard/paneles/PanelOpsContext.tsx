"use client";
import { createContext, useContext, useState } from "react";

interface Ops {
  guardar: () => void
  setGuardar: (fn: () => void) => void
  mostrarHistorial: () => void
  setMostrarHistorial: (fn: () => void) => void
  undo: () => void
  setUndo: (fn: () => void) => void
  redo: () => void
  setRedo: (fn: () => void) => void
}

const PanelOpsContext = createContext<Ops>({
  guardar: () => {},
  setGuardar: () => {},
  mostrarHistorial: () => {},
  setMostrarHistorial: () => {},
  undo: () => {},
  setUndo: () => {},
  redo: () => {},
  setRedo: () => {},
})

export function PanelOpsProvider({ children }: { children: React.ReactNode }) {
  const [guardarFn, setGuardarFn] = useState<() => void>(() => {});
  const [mostrarFn, setMostrarFn] = useState<() => void>(() => {});
  const [undoFn, setUndoFn] = useState<() => void>(() => {});
  const [redoFn, setRedoFn] = useState<() => void>(() => {});
  return (
    <PanelOpsContext.Provider
      value={{
        guardar: guardarFn,
        setGuardar: setGuardarFn,
        mostrarHistorial: mostrarFn,
        setMostrarHistorial: setMostrarFn,
        undo: undoFn,
        setUndo: setUndoFn,
        redo: redoFn,
        setRedo: setRedoFn,
      }}
    >
      {children}
    </PanelOpsContext.Provider>
  );
}

export function usePanelOps() {
  return useContext(PanelOpsContext);
}
