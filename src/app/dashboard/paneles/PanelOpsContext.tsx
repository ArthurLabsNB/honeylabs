"use client";
import { createContext, useContext, useState, useMemo } from "react";

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
  mostrarChat: () => void
  setMostrarChat: (fn: () => void) => void
  readOnly: boolean
  toggleReadOnly: () => void
  setReadOnly?: (v: boolean) => void
  zoom: number
  setZoom: (z: number) => void
  buscar: string
  setBuscar: (term: string) => void
  showGrid: boolean
  toggleGrid: () => void
  gridSize: number
  setGridSize: (v: number) => void
  unsaved: boolean
  setUnsaved: (v: boolean) => void
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
  mostrarChat: () => {},
  setMostrarChat: () => {},
  readOnly: false,
  toggleReadOnly: () => {},
  setReadOnly: () => {},
  zoom: 1,
  setZoom: () => {},
  buscar: '',
  setBuscar: () => {},
  showGrid: false,
  toggleGrid: () => {},
  gridSize: 95,
  setGridSize: () => {},
  unsaved: false,
  setUnsaved: () => {},
})

export function PanelOpsProvider({ children }: { children: React.ReactNode }) {
  const [guardarFn, setGuardarFn] = useState<() => void>(() => {});
  const [mostrarFn, setMostrarFn] = useState<() => void>(() => {});
  const [mostrarCambiosFn, setMostrarCambiosFn] = useState<() => void>(() => {});
  const [mostrarComentariosFn, setMostrarComentariosFn] = useState<() => void>(() => {});
  const [mostrarChatFn, setMostrarChatFn] = useState<() => void>(() => {});
  const [undoFn, setUndoFn] = useState<() => void>(() => {});
  const [redoFn, setRedoFn] = useState<() => void>(() => {});
  const [readOnly, setReadOnly] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [buscar, setBuscar] = useState('');
  const [showGrid, setShowGrid] = useState(false);
  const [gridSize, setGridSize] = useState(95);
  const [unsaved, setUnsaved] = useState(false);
  const value = useMemo(
    () => ({
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
      mostrarChat: mostrarChatFn,
      setMostrarChat: setMostrarChatFn,
      readOnly,
      toggleReadOnly: () => setReadOnly((v) => !v),
      setReadOnly,
      zoom,
      setZoom,
      buscar,
      setBuscar,
      showGrid,
      toggleGrid: () => setShowGrid((v) => !v),
      gridSize,
      setGridSize,
      unsaved,
      setUnsaved,
    }),
    [
      guardarFn,
      mostrarFn,
      mostrarCambiosFn,
      mostrarComentariosFn,
      mostrarChatFn,
      undoFn,
      redoFn,
      readOnly,
      zoom,
      buscar,
      showGrid,
      gridSize,
      unsaved,
    ],
  )
  return (
    <PanelOpsContext.Provider value={value}>{children}</PanelOpsContext.Provider>
  )
}

export function usePanelOps() {
  return useContext(PanelOpsContext);
}
