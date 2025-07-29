"use client";
import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import type { Material } from "../components/MaterialRow";
import type { UnidadDetalle } from "@/types/unidad-detalle";
import useMateriales from "@/hooks/useMateriales";

interface BoardState {
  materiales: Material[];
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  unidadSel: UnidadDetalle | null;
  setUnidadSel: (u: UnidadDetalle | null) => void;
  auditoriaSel: number | null;
  setAuditoriaSel: (id: number | null) => void;
  isLoading: boolean;
  error: any;
  crear: (m: Material) => Promise<any>;
  actualizar: (m: Material) => Promise<any>;
  eliminar: (id: number, motivo?: string) => Promise<any>;
  duplicar: (id: number) => Promise<any>;
  mutate: () => void;
}

const Context = createContext<BoardState | null>(null);

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const { materiales, isLoading, error, crear, actualizar, eliminar, duplicar, mutate } =
    useMateriales(id as string);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [unidadSel, setUnidadSel] = useState<UnidadDetalle | null>(null);
  const [auditoriaSel, setAuditoriaSel] = useState<number | null>(null);

  const setSelId = useCallback((v: string | null) => setSelectedId(v), []);
  const setUni = useCallback((v: UnidadDetalle | null) => setUnidadSel(v), []);
  const setAud = useCallback((v: number | null) => setAuditoriaSel(v), []);

  useEffect(() => {
    setSelId(null);
    setUni(null);
    setAud(null);
  }, [id, setSelId, setUni, setAud]);

  const value = useMemo(
    () => ({
      materiales,
      selectedId,
      setSelectedId: setSelId,
      unidadSel,
      setUnidadSel: setUni,
      auditoriaSel,
      setAuditoriaSel: setAud,
      isLoading,
      error,
      crear,
      actualizar,
      eliminar,
      duplicar,
      mutate,
    }),
    [materiales, selectedId, unidadSel, auditoriaSel, crear, actualizar, eliminar, duplicar, isLoading, error, mutate, setSelId, setUni, setAud]
  );

  if (!id) return <>{children}</>;

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useBoard() {
  const ctx = useContext(Context);
  if (!ctx) throw new Error('BoardProvider missing');
  return ctx;
}
