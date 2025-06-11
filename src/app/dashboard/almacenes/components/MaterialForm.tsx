"use client";
import { ChangeEvent } from "react";
import { useToast } from "@/components/Toast";

const MAX_FILE_MB = 20;
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
  const toast = useToast();
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
    } else if (campo === 'archivos') {
      const files = Array.from((e.target as HTMLInputElement).files || []);
      const valid = files.filter((f) => {
        if (f.size > MAX_FILE_MB * 1024 * 1024) {
          toast.show(`Archivo demasiado grande: ${f.name}`, 'error');
          return false;
        }
        return true;
      });
      onChange(campo, valid);
    } else {
      onChange(campo, e.target.value);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor="material-nombre" className="text-xs text-[var(--dashboard-muted)]">Nombre</label>
        <input
          id="material-nombre"
          value={material.nombre ?? ""}
          onChange={handle("nombre")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div>
        <label htmlFor="material-descripcion" className="text-xs text-[var(--dashboard-muted)]">Descripción</label>
        <textarea
          id="material-descripcion"
          value={material.descripcion ?? ""}
          onChange={handle("descripcion")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div>
        <label htmlFor="material-num-unidades" className="text-xs text-[var(--dashboard-muted)]">Número de unidades</label>
        <input
          id="material-num-unidades"
          value={unidades.length}
          readOnly
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div>
        <label htmlFor="material-unidad" className="text-xs text-[var(--dashboard-muted)]">Unidad de medida base</label>
        <select
          id="material-unidad"
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
        <label htmlFor="material-ubicacion" className="text-xs text-[var(--dashboard-muted)]">Ubicación</label>
        <input
          id="material-ubicacion"
          value={material.ubicacion ?? ""}
          onChange={handle("ubicacion")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="material-codigo-barra" className="text-xs text-[var(--dashboard-muted)]">Código de barras</label>
          <input
            id="material-codigo-barra"
            value={material.codigoBarra ?? ""}
            onChange={handle("codigoBarra")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label htmlFor="material-codigo-qr" className="text-xs text-[var(--dashboard-muted)]">Código QR</label>
          <input
            id="material-codigo-qr"
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
        <label htmlFor="material-observaciones" className="text-xs text-[var(--dashboard-muted)]">Observaciones</label>
        <textarea
          id="material-observaciones"
          value={material.observaciones ?? ""}
          onChange={handle("observaciones")}
          className="dashboard-input w-full mt-1"
        />
      </div>
      <div>
        <label htmlFor="material-miniatura" className="text-xs text-[var(--dashboard-muted)]">Miniatura</label>
        <input
          id="material-miniatura"
          type="file"
          onChange={handle("miniatura") as any}
          className="dashboard-input w-full mt-1"
        />
        {(material.miniatura || material.miniaturaUrl) && (
          <div className="mt-2 flex items-start gap-2">
            <img
              src={
                material.miniatura
                  ? URL.createObjectURL(material.miniatura)
                  : (material.miniaturaUrl as string)
              }
              alt="miniatura"
              className="w-24 h-24 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => onChange('miniatura', null)}
              className="px-2 py-1 bg-red-600 text-white text-xs rounded"
            >
              Quitar
            </button>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="material-archivos" className="text-xs text-[var(--dashboard-muted)]">Archivos adjuntos</label>
        <input
          id="material-archivos"
          type="file"
          multiple
          onChange={handle('archivos') as any}
          className="dashboard-input w-full mt-1"
        />
        {material.archivos && material.archivos.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm">
            {material.archivos.map((f, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="flex-1 truncate">{f.name}</span>
                <a
                  href={URL.createObjectURL(f)}
                  download={f.name}
                  className="px-1 py-0.5 bg-blue-600 text-white text-xs rounded"
                >
                  Descargar
                </a>
                <button
                  type="button"
                  onClick={() =>
                    onChange('archivos', material.archivos!.filter((_, idx) => idx !== i))
                  }
                  className="px-1 py-0.5 bg-red-600 text-white text-xs rounded"
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>
        )}
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
