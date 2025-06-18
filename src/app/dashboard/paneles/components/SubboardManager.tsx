"use client"
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Board { id: string; nombre: string }

export default function SubboardManager({ open, boards, setBoards, onSelect, onClose }: {
  open: boolean
  boards: Board[]
  setBoards: (b: Board[]) => void
  onSelect: (id: string) => void
  onClose: () => void
}) {
  const sensors = useSensors(useSensor(PointerSensor))
  const handleDragEnd = (ev: DragEndEvent) => {
    const { active, over } = ev
    if (over && active.id !== over.id) {
      const oldIndex = boards.findIndex(b => b.id === active.id)
      const newIndex = boards.findIndex(b => b.id === over.id)
      const arr = arrayMove(boards, oldIndex, newIndex)
      setBoards(arr)
      localStorage.setItem('panel-subboards-order', JSON.stringify(arr))
    }
  }
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center" onClick={onClose}>
      <div className="bg-[var(--dashboard-card)] p-4 rounded w-64" onClick={e => e.stopPropagation()}>
        <h2 className="font-semibold mb-2">Subpizarras</h2>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={boards} strategy={verticalListSortingStrategy}>
            {boards.map(b => <Item key={b.id} id={b.id} nombre={b.nombre} onSelect={onSelect} />)}
          </SortableContext>
        </DndContext>
        <button onClick={onClose} className="mt-3 px-3 py-1 bg-white/10 rounded w-full text-sm">Cerrar</button>
      </div>
    </div>
  )
}

function Item({ id, nombre, onSelect }: { id: string; nombre: string; onSelect: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="px-2 py-1 bg-white/10 rounded mb-1 cursor-move" onClick={() => onSelect(id)}>
      {nombre}
    </div>
  )
}
