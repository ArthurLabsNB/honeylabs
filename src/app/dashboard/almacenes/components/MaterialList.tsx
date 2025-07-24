"use client";
import { useMemo, useState } from "react";
import { useToast } from "@/components/Toast";
import ImageModal from "@/components/ImageModal";
import useObjectUrl from "@/hooks/useObjectUrl";
import { parseId } from "@/lib/parseId";
import type { Material } from "./MaterialRow";

interface Props {
  materiales: Material[];
  selectedId: string | null;
  onSeleccion: (id: string) => void;
  busqueda: string;
  setBusqueda: (v: string) => void;
  orden: "nombre" | "cantidad";
  setOrden: (v: "nombre" | "cantidad") => void;
  onNuevo: () => Promise<any>;
  onDuplicar: (id: string) => void;
  onEliminar: (id: number) => Promise<any>;
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
  onEliminar,
}: Props) {
  const toast = useToast();
  const filtrados = useMemo(
    () =>
      materiales
        .filter((m) => {
          const q = busqueda.toLowerCase();
          return (
            (m.nombre ?? '').toLowerCase().includes(q) ||
            (m.lote ?? '').toLowerCase().includes(q) ||
            (m.codigoBarra ?? '').toLowerCase().includes(q) ||
            (m.codigoQR ?? '').toLowerCase().includes(q)
          );
        })
        .sort((a, b) =>
          orden === 'nombre' ? a.nombre.localeCompare(b.nombre) : a.cantidad - b.cantidad,
        ),
    [materiales, busqueda, orden],
  );

  const totalStock = useMemo(
    () => materiales.reduce((sum, m) => sum + (m.cantidad ?? 0), 0),
    [materiales],
  );

  const [preview, setPreview] = useState<string | null>(null);

  function Miniatura({ m }: { m: Material }) {
    const url = useObjectUrl(m.miniatura instanceof File ? m.miniatura : undefined);
    const src = m.miniatura instanceof File ? url : (typeof m.miniatura === 'string' ? m.miniatura : m.miniaturaUrl as string | null);
    if (!src) return null;
    return (
      <img
        src={src}
        className="w-32 h-32 object-contain rounded cursor-pointer"
        alt="miniatura"
        onClick={(e) => {
          e.stopPropagation();
          setPreview(src);
        }}
      />
    );
  }

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
          className="dashboard-select no-drag"
        >
          <option value="nombre">Nombre</option>
          <option value="cantidad">Cantidad</option>
        </select>
        <button
          type="button"
          onClick={() => {
            setBusqueda('');
            setOrden('nombre');
          }}
          className="px-3 py-1 rounded bg-white/10 text-sm"
        >
          Limpiar
        </button>
      </div>
      <ul className="space-y-2 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {filtrados.map((m) => (
          <li key={m.id} className="relative group">
            <button
              type="button"
              onClick={() => onSeleccion(m.id)}
              className={`dashboard-card w-full text-left flex items-center gap-4 ${m.id === selectedId ? 'border-[var(--dashboard-accent)]' : 'hover:border-[var(--dashboard-accent)]'}`}
            >
              {(m.miniatura || m.miniaturaUrl) && <Miniatura m={m} />}
              <div className="flex flex-col flex-1">
                <span className="font-semibold">{m.nombre}</span>
                <span className="text-xs">Stock: {m.numUnidades ?? 0}</span>
                {m.lote && <span className="text-xs">Lote: {m.lote}</span>}
              </div>
            </button>
            <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicar(m.id);
                }}
                className="px-1 py-0.5 text-xs rounded bg-white/10"
              >
                Duplicar
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const id = parseId(m.id);
                  if (!id) {
                    toast.show('ID inválido', 'error');
                    return;
                  }
                  onEliminar(id);
                }}
                className="px-1 py-0.5 text-xs rounded bg-red-600 text-white"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-xs text-right">Total stock: {totalStock}</p>
      <div className="flex gap-2">
        <span title="Crear un material nuevo" className="flex-1">
          <button
            type="button"
            onClick={async () => {
              const res = await onNuevo();
              if (res?.error) toast.show(res.error, 'error');
              else toast.show('Material creado', 'success');
            }}
            className="w-full py-1 rounded-md bg-[var(--dashboard-accent)] text-black text-sm hover:bg-[var(--dashboard-accent-hover)]"
          >
            Nuevo Material
          </button>
        </span>
      </div>
      {preview && (
        <ImageModal src={preview} onClose={() => setPreview(null)} />
      )}
    </div>
  );
}
