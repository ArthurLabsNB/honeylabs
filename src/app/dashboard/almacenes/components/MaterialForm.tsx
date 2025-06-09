"use client";
import { ChangeEvent } from "react";
import type { Material } from "./MaterialRow";

interface Props {
  material: Material | null;
  onChange: (campo: keyof Material, valor: string | number) => void;
  onGuardar: () => void;
  onCancelar: () => void;
  onDuplicar: () => void;
}

export default function MaterialForm({
  material,
  onChange,
  onGuardar,
  onCancelar,
  onDuplicar,
}: Props) {
  if (!material)
    return (
      <p className="text-sm text-[var(--dashboard-muted)]">Selecciona o crea un material.</p>
    );

  const handle = (campo: keyof Material) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(campo, campo === "cantidad" ? Number(e.target.value) : e.target.value);
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Nombre</label>
        <input
          value={material.producto}
          onChange={handle("producto")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Descripción</label>
        <textarea
          value={material.descripcion || ""}
          onChange={handle("descripcion")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Cantidad</label>
          <input
            type="number"
            value={material.cantidad}
            onChange={handle("cantidad")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Lote</label>
          <input
            value={material.lote}
            onChange={handle("lote")}
            className="dashboard-input w-full mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Fecha caducidad</label>
          <input
            type="date"
            value={material.fechaCaducidad || ""}
            onChange={handle("fechaCaducidad")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Ubicación</label>
          <input
            value={material.ubicacion || ""}
            onChange={handle("ubicacion")}
            className="dashboard-input w-full mt-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Proveedor</label>
          <input
            value={material.proveedor || ""}
            onChange={handle("proveedor")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Estado</label>
          <input
            value={material.estado || ""}
            onChange={handle("estado")}
            className="dashboard-input w-full mt-1"
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Observaciones</label>
        <textarea
          value={material.observaciones || ""}
          onChange={handle("observaciones")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <button
          onClick={onGuardar}
          className="px-4 py-2 rounded-lg bg-[var(--dashboard-accent)] text-black text-sm hover:bg-[var(--dashboard-accent-hover)]"
        >
          Guardar
        </button>
        <button
          onClick={onCancelar}
          className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm"
        >
          Cancelar
        </button>
        <button
          onClick={onDuplicar}
          className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm"
        >
          Duplicar
        </button>
      </div>
    </div>
  );
}
