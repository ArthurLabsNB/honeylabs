"use client";
import { useMemo } from "react";
import type { Material } from "./MaterialRow";

interface Props {
  materiales: Material[];
  selectedId: string | null;
  onSeleccion: (id: string) => void;
  busqueda: string;
  setBusqueda: (v: string) => void;
  orden: "nombre" | "cantidad";
  setOrden: (v: "nombre" | "cantidad") => void;
  onNuevo: () => void;
  onDuplicar: () => void;
}

export default function MaterialList({
  materiales,
  selectedId,
  onSeleccion,
  busqueda,
  setBusqueda,
  orden,
  setOrden,
  onNuevo,
  onDuplicar,
}: Props) {
  const filtrados = useMemo(
    () =>
      materiales
        .filter((m) => (m?.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()))
        .sort((a, b) =>
          orden === "nombre" ? a.nombre.localeCompare(b.nombre) : a.cantidad - b.cantidad,
        ),
    [materiales, busqueda, orden],
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar"
          className="flex-1 p-2 rounded-md bg-white/5 focus:outline-none"
        />
        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value as any)}
          className="p-2 rounded-md bg-white/5"
        >
          <option value="nombre">Nombre</option>
          <option value="cantidad">Cantidad</option>
        </select>
      </div>
      <ul className="space-y-1 overflow-y-auto max-h-[calc(100vh-16rem)]">
        {filtrados.map((m) => (
          <li key={m.id}>
            <button
              onClick={() => onSeleccion(m.id)}
              className={`w-full text-left p-2 rounded-md transition ${m.id === selectedId ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              {m.nombre}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <button
          onClick={onNuevo}
          className="flex-1 py-1 rounded-md bg-[var(--dashboard-accent)] text-black text-sm hover:bg-[var(--dashboard-accent-hover)]"
        >
          Nuevo
        </button>
        <button
          onClick={onDuplicar}
          disabled={selectedId === null}
          className="flex-1 py-1 rounded-md bg-white/10 text-white text-sm disabled:opacity-50"
        >
          Duplicar
        </button>
      </div>
    </div>
  );
}
