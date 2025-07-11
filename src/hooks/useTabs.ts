"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TabType =
  | "materiales"
  | "unidades"
  | "auditorias"
  | "form-material"
  | "form-unidad";

export interface Tab {
  id: string;
  title: string;
  type: TabType;
  pinned?: boolean;
  collapsed?: boolean;
  minimized?: boolean;
  popout?: boolean;
}

interface TabState {
  tabs: Tab[];
  activeId: string | null;
  add: (tab: Tab) => void;
  close: (id: string) => void;
  move: (from: number, to: number) => void;
  setActive: (id: string) => void;
  update: (id: string, data: Partial<Tab>) => void;
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
      add: (tab) =>
        set((state) => ({ tabs: [...state.tabs, tab], activeId: tab.id })),
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
    }),
    {
      name: "honey-tabs",
      skipHydration: true,
    },
  ),
);
