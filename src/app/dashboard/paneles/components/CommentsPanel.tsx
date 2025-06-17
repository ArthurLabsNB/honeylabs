"use client";
import { useState } from "react";
import { usePanelOps } from "../PanelOpsContext";

interface Comment {
  id: number;
  texto: string;
  autor: string;
  fecha: string;
}

export default function CommentsPanel({ comentarios, onAdd }: { comentarios: Comment[]; onAdd: (texto: string) => void }) {
  const { setMostrarComentarios } = usePanelOps();
  const [texto, setTexto] = useState("");
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40" onClick={() => setMostrarComentarios(() => {})}>
      <div className="bg-[var(--dashboard-card)] p-4 rounded max-h-[80vh] overflow-auto w-80" onClick={e => e.stopPropagation()}>
        <h2 className="font-semibold mb-2">Comentarios</h2>
        <ul className="space-y-2 text-sm">
          {comentarios.map(c => (
            <li key={c.id} className="border-b border-white/10 pb-1">
              <span className="font-semibold">{c.autor}</span>
              <span className="text-xs ml-2 text-gray-400">{new Date(c.fecha).toLocaleString()}</span>
              <p>{c.texto}</p>
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
              onAdd(texto.trim());
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
