import { create } from 'zustand'

export interface Board {
  id: string
  title: string
}

interface BoardState {
  activeId: string
  setActive: (id: string) => void
}

export const useBoardStore = create<BoardState>((set) => ({
  activeId: 'main',
  setActive: (id) => set({ activeId: id }),
}))

export function ensureBoardsHydrated() {
  // single fixed board, no hydration required
}
