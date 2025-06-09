"use client";
import { ChangeEvent } from "react";
import type { UnidadDetalle } from "@/types/unidad-detalle";

interface Props {
  unidad: UnidadDetalle | null;
  onChange: (campo: keyof UnidadDetalle, valor: any) => void;
  onGuardar: () => void;
  onCancelar: () => void;
}

export default function UnidadForm({ unidad, onChange, onGuardar, onCancelar }: Props) {
  if (!unidad)
    return (
      <p className="text-sm text-[var(--dashboard-muted)]">Selecciona o crea una unidad.</p>
    );

  const numericFields: Array<keyof UnidadDetalle> = [
    "peso",
    "volumen",
    "alto",
    "largo",
    "ancho",
  ];

  const handle = (campo: keyof UnidadDetalle) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { type, value, files, checked } = e.target as HTMLInputElement;
    let val: any = value;
    if (type === "checkbox") val = checked;
    else if (type === "file") val = files ? (campo === "archivos" ? Array.from(files) : files[0]) : null;
    else if (numericFields.includes(campo)) val = Number(value);
    onChange(campo, val);
  };

  return (
    <div className="space-y-4 overflow-y-auto p-2 max-h-[calc(100vh-8rem)]">
      <section className="space-y-2">
        <h3 className="font-semibold">Identificación y control</h3>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Nombre del material</label>
          <input
            value={unidad.nombreMaterial ?? ""}
            onChange={handle("nombreMaterial")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">ID interno</label>
          <input
            value={unidad.internoId ?? ""}
            onChange={handle("internoId")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Número de serie</label>
          <input
            value={unidad.serie ?? ""}
            onChange={handle("serie")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Código de barras</label>
            <input
              value={unidad.codigoBarra ?? ""}
              onChange={handle("codigoBarra")}
              className="dashboard-input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Código QR</label>
            <input
              value={unidad.codigoQR ?? ""}
              onChange={handle("codigoQR")}
              className="dashboard-input w-full mt-1"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Lote</label>
          <input
            value={unidad.lote ?? ""}
            onChange={handle("lote")}
            className="dashboard-input w-full mt-1"
          />
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Medición y propiedades físicas</h3>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Unidad de medida</label>
          <input
            value={unidad.unidadMedida ?? ""}
            onChange={handle("unidadMedida")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Peso</label>
            <input
              type="number"
              value={unidad.peso ?? ""}
              onChange={handle("peso")}
              className="dashboard-input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Volumen</label>
            <input
              type="number"
              value={unidad.volumen ?? ""}
              onChange={handle("volumen")}
              className="dashboard-input w-full mt-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Alto</label>
            <input
              type="number"
              value={unidad.alto ?? ""}
              onChange={handle("alto")}
              className="dashboard-input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Largo</label>
            <input
              type="number"
              value={unidad.largo ?? ""}
              onChange={handle("largo")}
              className="dashboard-input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Ancho</label>
            <input
              type="number"
              value={unidad.ancho ?? ""}
              onChange={handle("ancho")}
              className="dashboard-input w-full mt-1"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Color</label>
          <input
            value={unidad.color ?? ""}
            onChange={handle("color")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Temperatura ideal</label>
          <input
            value={unidad.temperatura ?? ""}
            onChange={handle("temperatura")}
            className="dashboard-input w-full mt-1"
          />
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Estado y ubicación</h3>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Estado</label>
          <input
            value={unidad.estado ?? ""}
            onChange={handle("estado")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Ubicación exacta</label>
          <input
            value={unidad.ubicacionExacta ?? ""}
            onChange={handle("ubicacionExacta")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Área o zona</label>
            <input
              value={unidad.area ?? ""}
              onChange={handle("area")}
              className="dashboard-input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Subcategoría</label>
            <input
              value={unidad.subcategoria ?? ""}
              onChange={handle("subcategoria")}
              className="dashboard-input w-full mt-1"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Riesgo</label>
          <input
            value={unidad.riesgo ?? ""}
            onChange={handle("riesgo")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={unidad.disponible ?? false}
            onChange={handle("disponible")}
          />
          <label className="text-xs text-[var(--dashboard-muted)]">Disponible</label>
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Asignado a</label>
          <input
            value={unidad.asignadoA ?? ""}
            onChange={handle("asignadoA")}
            className="dashboard-input w-full mt-1"
          />
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Fechas y seguimiento</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Ingreso</label>
            <input
              type="date"
              value={unidad.fechaIngreso ?? ""}
              onChange={handle("fechaIngreso")}
              className="dashboard-input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Última modificación</label>
            <input
              type="date"
              value={unidad.fechaModificacion ?? ""}
              onChange={handle("fechaModificacion")}
              className="dashboard-input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Caducidad</label>
            <input
              type="date"
              value={unidad.fechaCaducidad ?? ""}
              onChange={handle("fechaCaducidad")}
              className="dashboard-input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Última inspección</label>
            <input
              type="date"
              value={unidad.fechaInspeccion ?? ""}
              onChange={handle("fechaInspeccion")}
              className="dashboard-input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Fecha de baja</label>
            <input
              type="date"
              value={unidad.fechaBaja ?? ""}
              onChange={handle("fechaBaja")}
              className="dashboard-input w-full mt-1"
            />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Responsable y uso</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Responsable del ingreso</label>
            <input
              value={unidad.responsableIngreso ?? ""}
              onChange={handle("responsableIngreso")}
              className="dashboard-input w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Modificado por</label>
            <input
              value={unidad.modificadoPor ?? ""}
              onChange={handle("modificadoPor")}
              className="dashboard-input w-full mt-1"
            />
          </div>
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Proyecto asociado</label>
          <input
            value={unidad.proyecto ?? ""}
            onChange={handle("proyecto")}
            className="dashboard-input w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Observaciones</label>
          <textarea
            value={unidad.observaciones ?? ""}
            onChange={handle("observaciones")}
            className="dashboard-input w-full mt-1"
          />
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Extras</h3>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Imagen</label>
          <input type="file" onChange={handle("imagen") as any} className="dashboard-input w-full mt-1" />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Archivos adjuntos</label>
          <input type="file" multiple onChange={handle("archivos") as any} className="dashboard-input w-full mt-1" />
        </div>
      </section>

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
      </div>
    </div>
  );
}

