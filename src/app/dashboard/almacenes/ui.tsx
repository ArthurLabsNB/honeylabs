"use client";
import { createContext, useContext, useState, useCallback } from "react";

type View = "list" | "grid" | "tree";
type Filter = "todos" | "favoritos";
interface AlmacenesUIState {
  view: View;
  setView: (view: View) => void;
  filter: Filter;
  setFilter: (f: Filter) => void;
  onCreate?: (nombre: string, descripcion: string) => void;
  registerCreate: (fn: (nombre: string, descripcion: string) => void) => void;
}

const AlmacenesUIContext = createContext<AlmacenesUIState>({
  view: "list",
  setView: () => {},
  filter: "todos",
  setFilter: () => {},
});

export function AlmacenesUIProvider({
  children,
  onCreate,
}: {
  children: React.ReactNode;
  onCreate?: (nombre: string, descripcion: string) => void;
}) {
  const [view, setView] = useState<View>("list");
  const [filter, setFilter] = useState<Filter>("todos");
  const [createFn, setCreateFn] = useState<
    ((nombre: string, descripcion: string) => void) | undefined
  >(onCreate);

  const registerCreate = useCallback(
    (fn: (nombre: string, descripcion: string) => void) => {
      setCreateFn(() => fn);
    },
    [],
  );
  return (
    <AlmacenesUIContext.Provider
      value={{
        view,
        setView,
        filter,
        setFilter,
        onCreate: createFn,
        registerCreate,
      }}
      data-oid="h6e5smo"
    >
      {children}
    </AlmacenesUIContext.Provider>
  );
}

export function useAlmacenesUI() {
  return useContext(AlmacenesUIContext);
}
