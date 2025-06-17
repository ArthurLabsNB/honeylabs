"use client";
import { useState, useEffect } from "react";
import { usePanelOps } from "../PanelOpsContext";

interface Comment {
  id: number
  texto: string
  autor: string
  fecha: string
  widgetId?: string
}

export default function CommentsPanel({ comentarios, onAdd, widgetId }: { comentarios: Comment[]; onAdd: (texto: string, widgetId?: string) => void; widgetId?: string }) {
  const { setMostrarComentarios } = usePanelOps()
  const [texto, setTexto] = useState("")
  const [reacciones, setReacciones] = useState<Record<number, Record<string, number>>>({})

  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem("reacciones") || "{}")
      setReacciones(data)
    } catch {
      setReacciones({})
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("reacciones", JSON.stringify(reacciones))
  }, [reacciones])

  const reaccionar = (id: number, emoji: string) => {
    setReacciones(prev => {
      const actual = prev[id] || {}
      const count = actual[emoji] || 0
      return { ...prev, [id]: { ...actual, [emoji]: count + 1 } }
    })
  }
  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMostrarComentarios(() => {})
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [])
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40" onClick={() => setMostrarComentarios(() => {})}>
      <div className="bg-[var(--dashboard-card)] p-4 rounded max-h-[80vh] overflow-auto w-80" onClick={e => e.stopPropagation()}>
        <h2 className="font-semibold mb-2">Comentarios</h2>
        <ul className="space-y-2 text-sm">
          {comentarios.map(c => (
            <li key={c.id} className="border-b border-white/10 pb-1 space-y-1">
              <div>
                <span className="font-semibold">{c.autor}</span>
                <span className="text-xs ml-2 text-gray-400">{new Date(c.fecha).toLocaleString()}</span>
                {c.widgetId && (
                  <span className="text-xs ml-2 text-blue-400">[{c.widgetId}]</span>
                )}
              </div>
              <p>{c.texto}</p>
              <div className="flex gap-2 text-lg">
                {['👍','❤️','😄'].map(e => (
                  <button key={e} onClick={() => reaccionar(c.id, e)}>
                    {e} {reacciones[c.id]?.[e] || 0}
                  </button>
                ))}
              </div>
            </li>
          ))}
          {!comentarios.length && <li className="text-gray-400">Sin comentarios</li>}
        </ul>
        <textarea
          value={texto}
          onChange={e => setTexto(e.target.value)}
          className="w-full mt-3 p-2 bg-white/10 rounded text-sm"
          rows={3}
        />
        <button
          onClick={() => {
            if (texto.trim()) {
              onAdd(texto.trim(), widgetId);
              setTexto("");
            }
          }}
          className="mt-2 px-3 py-1 bg-white/10 rounded w-full text-sm"
        >
          Agregar
        </button>
        <button onClick={() => setMostrarComentarios(() => {})} className="mt-3 px-3 py-1 bg-white/10 rounded w-full text-sm">
          Cerrar
        </button>
      </div>
    </div>
  );
}

