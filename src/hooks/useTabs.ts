"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

function toArray<T>(val: unknown): T[] {
  return Array.isArray(val) ? (val as T[]) : []
}

export type TabType =
  | "materiales"
  | "unidades"
  | "auditorias"
  | "notas"
  | "board"
  | "url"
  | "form-material"
  | "form-unidad"
  | "form-auditoria";

export interface Tab {
  id: string;
  title: string;
  type: TabType;
  /** URL de destino para tarjetas de tipo "url" */
  url?: string;
  /** Identificador del tablero que contiene la tarjeta */
  boardId?: string;
  side?: "left" | "right";
  pinned?: boolean;
  collapsed?: boolean;
  popout?: boolean;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
}

interface TabState {
  tabs: Tab[];
  activeId: string | null;
  setTabs: (tabs: Tab[]) => void;
  add: (tab: Tab) => void;
  closeOthers: (id: string) => void;
  close: (id: string) => void;
  setActive: (id: string) => void;
  update: (id: string, data: Partial<Tab>) => void;
  rename: (id: string, title: string) => void;
}


export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeId: null,
      setTabs: (tabs) => set({ tabs }),
      add: (tab) =>
        set((state) => ({ tabs: [...toArray(state.tabs), tab], activeId: tab.id })),
      closeOthers: (id) =>
        set((state) => ({ tabs: toArray(state.tabs).filter((t) => t.id === id), activeId: id })),
      close: (id) =>
        set((state) => ({
          tabs: toArray(state.tabs).filter((t) => t.id !== id),
          activeId: state.activeId === id ? null : state.activeId,
        })),
      setActive: (id) => set({ activeId: id }),
      update: (id, data) =>
        set((state) => ({
          tabs: toArray(state.tabs).map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
      rename: (id, title) =>
        set((state) => ({
          tabs: toArray(state.tabs).map((t) => (t.id === id ? { ...t, title } : t)),
        })),
    }),
    {
      name: "honey-tabs",
      skipHydration: true,
    },
  ),
);

let hydrated = false
export function ensureTabsHydrated() {
  if (typeof window !== 'undefined' && !hydrated) {
    hydrated = true
    useTabStore.persist.rehydrate()
  }
}

ensureTabsHydrated()
