import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generarUUID } from '@/lib/uuid'

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
  remove: (id: string) => void
  duplicate: (id: string) => void
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
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
      remove: (id) =>
        set((s) => {
          const arr = s.boards.filter((b) => b.id !== id);
          if (arr.length === 0) {
            const nid = generarUUID();
            return { boards: [{ id: nid, title: 'New Tab' }], activeId: nid };
          }
          const activeId = s.activeId === id ? arr[0].id : s.activeId;
          return { boards: arr, activeId };
        }),
      duplicate: (id) =>
        set((s) => {
          const idx = s.boards.findIndex((b) => b.id === id);
          if (idx === -1) return {} as any;
          const src = s.boards[idx];
          const copy = { ...src, id: generarUUID() };
          const arr = s.boards.slice();
          arr.splice(idx + 1, 0, copy);
          return { boards: arr, activeId: copy.id };
        }),
    }),
    { name: 'honey-boards', skipHydration: true }
  )
)

