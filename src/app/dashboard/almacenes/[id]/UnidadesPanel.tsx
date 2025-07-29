"use client";
import { useMemo, useState } from "react";
import type { Material } from "../components/MaterialRow";
import useUnidades, { type Unidad as UnidadAPI } from "@/hooks/useUnidades";
import { useToast } from "@/components/Toast";
import { usePrompt } from "@/hooks/usePrompt";
import useObjectUrl from "@/hooks/useObjectUrl";
import { apiPath } from "@lib/api";

interface Props {
  material: Material | null;
  onChange: (campo: keyof Material, valor: Material[keyof Material]) => void;
  onSelect?: (u: UnidadAPI) => void;
  onBack?: () => void;
}

export default function UnidadesPanel({
  material,
  onChange,
  onSelect,
  onBack,
}: Props) {
  const [value, setValue] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const { unidades, crear, eliminar } = useUnidades(material?.dbId);
  const toast = useToast();
  const prompt = usePrompt();

  const add = async () => {
    const v = value.trim()
    if (!v) return
    if (!material?.dbId) {
      toast.show('Guarda el material antes de agregar unidades', 'error')
      return
    }
    const res = await crear({ nombre: v })
    if (res?.error) {
      toast.show(res.error, 'error')
      return
    }
    setValue('')
    onChange('unidad', v)
    toast.show("Unidad agregada", "success")
  };

  const select = (u: UnidadAPI) => {
    onChange("unidad", u.nombre);
    onSelect?.(u);
  };

  const remove = async (id: number) => {
    const motivo = await prompt('Motivo de eliminación')
    if (!motivo) return
    const res = await eliminar(id, motivo)
    if (res.success) toast.show('Unidad eliminada', 'success')
    else if (res.error) toast.show(res.error, 'error')
  };

  const filtrados = useMemo(
    () =>
      unidades.filter(
        (u) =>
          u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
          String(u.id).includes(busqueda),
      ),
    [unidades, busqueda],
  );

  function UnidadThumb({ unidad }: { unidad: UnidadAPI }) {
    const fileUrl = useObjectUrl(
      unidad.imagen instanceof File ? unidad.imagen : undefined,
    );
    const src = unidad.imagen instanceof File
      ? fileUrl
      : typeof unidad.imagen === 'string'
        ? `data:image/*;base64,${unidad.imagen}`
        : unidad.imagenNombre && material?.dbId
          ? apiPath(
              `/api/materiales/${material.dbId}/unidades/archivo?nombre=${encodeURIComponent(
                unidad.imagenNombre,
              )}`,
            )
          : null;
    if (!src) return null;
    return <img src={src} alt="miniatura" className="w-20 h-20 object-contain rounded" />;
  }

  return (
    <div className="p-4 border rounded-md space-y-2 mt-4">
      <div className="flex justify-between">
        <h2 className="font-semibold">Unidades</h2>
        {onBack && (
          <button onClick={onBack} className="text-xs text-[var(--dashboard-muted)]">
            Volver
          </button>
        )}
      </div>
      <div className="flex gap-2 items-center">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nueva"
          className="flex-1 p-1 rounded-md bg-white/5 focus:outline-none"
        />
        <button
          onClick={add}
          disabled={!material?.dbId}
          className="px-2 rounded-md bg-[var(--dashboard-accent)] text-black text-sm flex-shrink-0 whitespace-nowrap disabled:opacity-50"
        >
          Agregar
        </button>
      </div>
      <input
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscar"
        className="p-1 w-full rounded-md bg-white/5 focus:outline-none"
      />
      <ul className="space-y-1 max-h-96 overflow-y-auto">
        {filtrados.map((u, i) => (
          <li
            key={u.id}
            className={`dashboard-card cursor-pointer flex justify-between items-center gap-2 ${
              material?.unidad === u.nombre
                ? 'border-[var(--dashboard-accent)]'
                : 'hover:border-[var(--dashboard-accent)]'
            }`}
          >
            <span className="w-5 text-xs font-semibold">{i + 1}.</span>
            {(u.imagen || u.imagenNombre) && (
              <UnidadThumb unidad={u} />
            )}
            <div onClick={() => select(u)} className="flex flex-col flex-1 space-y-1">
              <span className="font-semibold text-sm">{u.nombre}</span>
              <span className="text-xs">ID: {u.id}</span>
              {u.lote && <span className="text-xs">Lote: {u.lote}</span>}
              {u.fechaIngreso && (
                <span className="text-xs">Ingreso: {u.fechaIngreso}</span>
              )}
              {u.fechaCaducidad && (
                <span className="text-xs">Caduca: {u.fechaCaducidad}</span>
              )}
              {u.codigoQR && (
                <span className="text-xs break-all">QR: {u.codigoQR}</span>
              )}
            </div>
            <button onClick={() => remove(u.id)} className="ml-2 text-xs">
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
