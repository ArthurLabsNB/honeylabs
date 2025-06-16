"use client";
import { useMemo, useState } from "react";
import ImageModal from "@/components/ImageModal";
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

  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          id="busqueda-materiales"
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
      <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {filtrados.map((m) => (
          <li key={m.id}>
            <button
              onClick={() => onSeleccion(m.id)}
              className={`dashboard-card w-full text-left flex items-center gap-4 ${m.id === selectedId ? 'border-[var(--dashboard-accent)]' : 'hover:border-[var(--dashboard-accent)]'}`}
            >
              {(m.miniatura || m.miniaturaUrl) && (
                <img
                  src={
                    m.miniatura
                      ? URL.createObjectURL(m.miniatura)
                      : (m.miniaturaUrl as string)
                  }
                  className="w-32 h-32 object-cover rounded cursor-pointer"
                  alt="miniatura"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPreview(
                      m.miniatura
                        ? URL.createObjectURL(m.miniatura)
                        : (m.miniaturaUrl as string)
                    );
                  }}
                />
              )}
              <div className="flex flex-col flex-1">
                <span className="font-semibold">{m.nombre}</span>
                <span className="text-xs">
                  Stock: {m.cantidad} {m.unidad}
                </span>
                {m.lote && (
                  <span className="text-xs">Lote: {m.lote}</span>
                )}
              </div>
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
      {preview && (
        <ImageModal src={preview} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}
