"use client"
import type { HistEntry } from '@/types/panel'

export default function HistorySidebar({ open, historial, onClose, restore }: {
  open: boolean
  historial: HistEntry[]
  onClose: () => void
  restore: (h: HistEntry) => void
}) {
  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-[var(--dashboard-card)] z-40 transform ${open ? 'translate-x-0' : 'translate-x-full'} transition-transform`}>
      <div className="p-4 h-full flex flex-col">
        <h2 className="font-semibold mb-2">Historial</h2>
        <ul className="space-y-2 text-sm flex-1 overflow-y-auto">
          {historial.map((h, i) => (
            <li key={i} className="flex justify-between items-center">
              <span>{new Date(h.fecha).toLocaleString()}</span>
              <button onClick={() => restore(h)} className="underline">Restaurar</button>
            </li>
          ))}
          {!historial.length && <li className="text-gray-400">Sin historial</li>}
        </ul>
        <span title="Cerrar historial">
          <button onClick={onClose} className="mt-3 px-3 py-1 bg-white/10 rounded w-full text-sm">Cerrar</button>
        </span>
      </div>
    </div>
  )
}
