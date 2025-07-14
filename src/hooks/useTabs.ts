"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TabType =
  | "materiales"
  | "unidades"
  | "auditorias"
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
  minimized?: boolean;
  popout?: boolean;
}

interface TabState {
  tabs: Tab[];
  activeId: string | null;
  setTabs: (tabs: Tab[]) => void;
  add: (tab: Tab) => void;
  addAfterActive: (tab: Tab) => void;
  closeOthers: (id: string) => void;
  close: (id: string) => void;
  move: (from: number, to: number) => void;
  setActive: (id: string) => void;
  update: (id: string, data: Partial<Tab>) => void;
  rename: (id: string, title: string) => void;
  minimizeAll: () => void;
  restoreAll: () => void;
}

function arrayMove<T>(arr: T[], from: number, to: number) {
  const copy = arr.slice();
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export const useTabStore = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: [],
      activeId: null,
      setTabs: (tabs) => set({ tabs }),
      add: (tab) =>
        set((state) => ({ tabs: [...state.tabs, tab], activeId: tab.id })),
      addAfterActive: (tab) =>
        set((state) => {
          const idx = state.activeId
            ? state.tabs.findIndex((t) => t.id === state.activeId)
            : -1;
          const pos = idx >= 0 ? idx + 1 : state.tabs.length;
          const arr = state.tabs.slice();
          arr.splice(pos, 0, tab);
          return { tabs: arr, activeId: tab.id };
        }),
      closeOthers: (id) =>
        set((state) => ({ tabs: state.tabs.filter((t) => t.id === id), activeId: id })),
      close: (id) =>
        set((state) => ({
          tabs: state.tabs.filter((t) => t.id !== id),
          activeId: state.activeId === id ? null : state.activeId,
        })),
      move: (from, to) =>
        set((state) => ({ tabs: arrayMove(state.tabs, from, to) })),
      setActive: (id) => set({ activeId: id }),
      update: (id, data) =>
        set((state) => ({
          tabs: state.tabs.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
      rename: (id, title) =>
        set((state) => ({
          tabs: state.tabs.map((t) => (t.id === id ? { ...t, title } : t)),
        })),
      minimizeAll: () =>
        set((state) => ({
          tabs: state.tabs.map((t) => ({ ...t, minimized: true })),
        })),
      restoreAll: () =>
        set((state) => ({
          tabs: state.tabs.map((t) => ({ ...t, minimized: false, collapsed: false })),
        })),
    }),
    {
      name: "honey-tabs",
      skipHydration: true,
    },
  ),
);
