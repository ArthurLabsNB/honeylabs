"use client";
import { createContext, useContext, useState } from "react";
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
  crear: (m: Material) => Promise<any>;
  actualizar: (m: Material) => Promise<any>;
  eliminar: (id: number) => Promise<any>;
  mutate: () => void;
}

const Context = createContext<BoardState>({
  materiales: [],
  selectedId: null,
  setSelectedId: () => {},
  unidadSel: null,
  setUnidadSel: () => {},
  auditoriaSel: null,
  setAuditoriaSel: () => {},
  crear: async () => ({}),
  actualizar: async () => ({}),
  eliminar: async () => ({}),
  mutate: () => {},
});

export function BoardProvider({ children }: { children: React.ReactNode }) {
  const { id } = useParams();
  const { materiales, crear, actualizar, eliminar, mutate } = useMateriales(id as string);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [unidadSel, setUnidadSel] = useState<UnidadDetalle | null>(null);
  const [auditoriaSel, setAuditoriaSel] = useState<number | null>(null);
  return (
    <Context.Provider
      value={{
        materiales,
        selectedId,
        setSelectedId,
        unidadSel,
        setUnidadSel,
        auditoriaSel,
        setAuditoriaSel,
        crear,
        actualizar,
        eliminar,
        mutate,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useBoard() {
  return useContext(Context);
}
