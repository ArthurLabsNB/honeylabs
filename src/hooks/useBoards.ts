import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Board {
  id: string
  title: string
}

interface BoardState {
  boards: Board[]
  activeId: string | null
  add: (b: Board) => void
  setActive: (id: string) => void
  rename: (id: string, title: string) => void
  move: (from: number, to: number) => void
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      boards: [],
      activeId: null,
      add: (b) =>
        set((s) => ({ boards: [...s.boards, b], activeId: b.id })),
      setActive: (id) => set({ activeId: id }),
      rename: (id, title) =>
        set((s) => ({ boards: s.boards.map((t) => (t.id === id ? { ...t, title } : t)) })),
      move: (from, to) =>
        set((s) => {
          const arr = s.boards.slice();
          const [it] = arr.splice(from, 1);
          arr.splice(to, 0, it);
          return { boards: arr };
        }),
    }),
    { name: 'honey-boards', skipHydration: true }
  )
)

