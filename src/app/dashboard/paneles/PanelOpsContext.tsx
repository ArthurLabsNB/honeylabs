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
  mostrarCambios: () => void
  setMostrarCambios: (fn: () => void) => void
  mostrarComentarios: () => void
  setMostrarComentarios: (fn: () => void) => void
  readOnly: boolean
  toggleReadOnly: () => void
  zoom: number
  setZoom: (z: number) => void
  buscar: string
  setBuscar: (term: string) => void
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
  mostrarCambios: () => {},
  setMostrarCambios: () => {},
  mostrarComentarios: () => {},
  setMostrarComentarios: () => {},
  readOnly: false,
  toggleReadOnly: () => {},
  zoom: 1,
  setZoom: () => {},
  buscar: '',
  setBuscar: () => {},
})

export function PanelOpsProvider({ children }: { children: React.ReactNode }) {
  const [guardarFn, setGuardarFn] = useState<() => void>(() => {});
  const [mostrarFn, setMostrarFn] = useState<() => void>(() => {});
  const [mostrarCambiosFn, setMostrarCambiosFn] = useState<() => void>(() => {});
  const [mostrarComentariosFn, setMostrarComentariosFn] = useState<() => void>(() => {});
  const [undoFn, setUndoFn] = useState<() => void>(() => {});
  const [redoFn, setRedoFn] = useState<() => void>(() => {});
  const [readOnly, setReadOnly] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [buscar, setBuscar] = useState('');
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
        mostrarCambios: mostrarCambiosFn,
        setMostrarCambios: setMostrarCambiosFn,
        mostrarComentarios: mostrarComentariosFn,
        setMostrarComentarios: setMostrarComentariosFn,
        readOnly,
        toggleReadOnly: () => setReadOnly((v) => !v),
        zoom,
        setZoom,
        buscar,
        setBuscar,
      }}
    >
      {children}
    </PanelOpsContext.Provider>
  );
}

export function usePanelOps() {
  return useContext(PanelOpsContext);
}
