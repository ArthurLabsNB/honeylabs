"use client";
import { ChangeEvent } from "react";
import type { Material } from "./MaterialRow";
import MaterialCodes from "./MaterialCodes";
import useUnidades from "@/hooks/useUnidades";

interface Props {
  material: Material | null;
  onChange: (campo: keyof Material, valor: any) => void;
  onGuardar: () => void;
  onCancelar: () => void;
  onDuplicar: () => void;
  onEliminar: () => void;
}

export default function MaterialForm({
  material,
  onChange,
  onGuardar,
  onCancelar,
  onDuplicar,
  onEliminar,
}: Props) {
  if (!material)
    return (
      <p className="text-sm text-[var(--dashboard-muted)]">Selecciona o crea un material.</p>
    );

  const { unidades } = useUnidades(material.dbId);


  const handle = (campo: keyof Material) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    if (campo === 'cantidad') {
      onChange(campo, Number(e.target.value));
    } else if (campo === 'miniatura') {
      onChange(campo, (e.target as HTMLInputElement).files?.[0] || null);
    } else {
      onChange(campo, e.target.value);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Nombre</label>
        <input
          value={material.nombre ?? ""}
          onChange={handle("nombre")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Descripción</label>
        <textarea
          value={material.descripcion ?? ""}
          onChange={handle("descripcion")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Número de unidades</label>
        <input
          value={unidades.length}
          readOnly
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Unidad de medida base</label>
        <select
          value={material.unidad ?? ""}
          onChange={handle("unidad")}
          className="dashboard-input w-full mt-1"
        >
          <option value="">-</option>
          <option value="pieza">pieza</option>
          <option value="kg">kg</option>
          <option value="g">g</option>
          <option value="L">L</option>
          <option value="ml">ml</option>
          <option value="m">m</option>
          <option value="cm">cm</option>
          <option value="mm">mm</option>
        </select>
      </div>
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Ubicación</label>
        <input
          value={material.ubicacion ?? ""}
          onChange={handle("ubicacion")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Código de barras</label>
          <input
            value={material.codigoBarra ?? ""}
            onChange={handle("codigoBarra")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Código QR</label>
          <input
            value={material.codigoQR ?? ""}
            onChange={handle("codigoQR")}
            className="dashboard-input w-full mt-1"
          />
        </div>
      </div>
      {/*
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Mínimo</label>
          <input
            type="number"
            value={material.minimo ?? ""}
            onChange={handle("minimo")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Máximo</label>
          <input
            type="number"
            value={material.maximo ?? ""}
            onChange={handle("maximo")}
            className="dashboard-input w-full mt-1"
          />
        </div>
      </div>
      */}
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Observaciones</label>
        <textarea
          value={material.observaciones ?? ""}
          onChange={handle("observaciones")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Miniatura</label>
        <input type="file" onChange={handle("miniatura") as any} className="dashboard-input w-full mt-1" />
      </div>
      <MaterialCodes value={material.nombre} />
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
        <button
          onClick={onEliminar}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}
