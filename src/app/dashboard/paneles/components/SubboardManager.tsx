"use client"
import GridLayout, { Layout } from 'react-grid-layout'
import { motion } from 'framer-motion'

interface Board { id: string; nombre: string }

export default function SubboardManager({ open, boards, setBoards, onSelect, onClose }: {
  open: boolean
  boards: Board[]
  setBoards: (b: Board[]) => void
  onSelect: (id: string) => void
  onClose: () => void
}) {
  if (!open) return null

  const layout: Layout[] = boards.map((b, i) => ({ i: b.id, x: 0, y: i, w: 1, h: 1 }))

  const handleLayout = (l: Layout[]) => {
    const order = l.slice().sort((a, b) => a.y - b.y).map(it => it.i as string)
    const arr = order.map(id => boards.find(b => b.id === id)!)
    setBoards(arr)
    try { localStorage.setItem('panel-subboards-order', JSON.stringify(arr)) } catch {}
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[var(--dashboard-card)] p-4 rounded w-64" onClick={e => e.stopPropagation()}>
        <h2 className="font-semibold mb-2">Subpizarras</h2>
        <GridLayout layout={layout} cols={1} rowHeight={40} width={220} onLayoutChange={handleLayout} draggableHandle=".subboard-item">
          {boards.map(b => (
            <div key={b.id}>
              <motion.div layout className="px-2 py-1 bg-white/10 rounded mb-1 cursor-move subboard-item" onClick={() => onSelect(b.id)}>
                {b.nombre}
              </motion.div>
            </div>
          ))}
        </GridLayout>
        <button onClick={onClose} className="mt-3 px-3 py-1 bg-white/10 rounded w-full text-sm">Cerrar</button>
      </div>
    </div>
  )
}
