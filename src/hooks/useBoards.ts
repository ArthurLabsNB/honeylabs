import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generarUUID } from '@/lib/uuid'
import { apiFetch } from '@lib/api'
import { jsonOrNull } from '@lib/http'

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
      const save = (boards: Board[], activeId: string | null) => {
        apiFetch('/api/dashboard/boards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ boards, activeId }),
        }).catch(() => {})
      }
      return {
        boards: [],
        activeId: null,
        add: (b) =>
          set((s) => {
            const boards = [...s.boards, b]
            save(boards, b.id)
            return { boards, activeId: b.id }
          }),
        setActive: (id) => set({ activeId: id }),
        rename: (id, title) =>
          set((s) => {
            const boards = s.boards.map((t) =>
              t.id === id ? { ...t, title } : t,
            )
            save(boards, s.activeId)
            return { boards }
          }),
        move: (from, to) => {
          if (frame) caf(frame)
          frame = raf(() => {
            set((s) => {
              const arr = s.boards.slice()
              const [it] = arr.splice(from, 1)
              arr.splice(to, 0, it)
              save(arr, s.activeId)
              return { boards: arr }
            })
            frame = 0
          })
        },
        remove: (id) =>
          set((s) => {
            const boards = s.boards.filter((b) => b.id !== id)
            const activeId =
              s.activeId === id ? boards[0]?.id ?? null : s.activeId
            save(boards, activeId)
            return {
              boards,
              activeId,
            }
          }),
        duplicate: (id) =>
          set((s) => {
            const original = s.boards.find((b) => b.id === id)
            if (!original) return s
            const copy: Board = { ...original, id: generarUUID() }
            const boards = [...s.boards, copy]
            save(boards, copy.id)
            return {
              boards,
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
    useBoardStore.persist
      .rehydrate()
      .then(() =>
        apiFetch('/api/dashboard/boards')
          .then(jsonOrNull)
          .then((d) => {
            if (d && Array.isArray(d.boards)) {
              useBoardStore.setState({
                boards: d.boards as Board[],
                activeId: d.activeId ?? d.boards[0]?.id ?? null,
              })
            }
          })
          .catch(() => {})
      )
      .catch(() => {})
  }
}
ensureBoardsHydrated()
