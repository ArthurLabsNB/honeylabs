import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generarUUID } from '@/lib/uuid'

const raf =
  typeof globalThis.requestAnimationFrame === 'function'
    ? globalThis.requestAnimationFrame
    : (cb: FrameRequestCallback) => {
        cb(Date.now())
        return 0
      }
const caf =
  typeof globalThis.cancelAnimationFrame === 'function'
    ? globalThis.cancelAnimationFrame
    : () => {}

let frame: number | undefined

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
    (set) => {
      const first: Board = { id: generarUUID(), title: 'New Tab' }
      return {
        boards: [first],
        activeId: first.id,
        add: (b) =>
          set((s) => ({ boards: [...s.boards, b], activeId: b.id })),
        setActive: (id) => set({ activeId: id }),
        rename: (id, title) =>
          set((s) => ({
            boards: s.boards.map((t) => (t.id === id ? { ...t, title } : t)),
          })),
        move: (from, to) => {
          if (frame) caf(frame)
          frame = raf(() => {
            set((s) => {
              const arr = s.boards.slice()
              const [it] = arr.splice(from, 1)
              arr.splice(to, 0, it)
              return { boards: arr }
            })
            frame = 0
          })
        },
        remove: (id) =>
          set((s) => {
            const boards = s.boards.filter((b) => b.id !== id)
            return {
              boards,
              activeId: s.activeId === id ? boards[0]?.id ?? null : s.activeId,
            }
          }),
        duplicate: (id) =>
          set((s) => {
            const original = s.boards.find((b) => b.id === id)
            if (!original) return s
            const copy: Board = { ...original, id: generarUUID() }
            return {
              boards: [...s.boards, copy],
              activeId: copy.id,
            }
          }),
      }
    },
    { name: 'honey-boards', skipHydration: true }
  )
)

let hasHydrated = false
export function ensureBoardsHydrated() {
  if (typeof window !== 'undefined' && !hasHydrated) {
    hasHydrated = true
    useBoardStore.persist.rehydrate()
  }
}
ensureBoardsHydrated()
