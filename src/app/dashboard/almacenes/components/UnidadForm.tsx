"use client";
import { ChangeEvent } from "react";
import MaterialCodes from "./MaterialCodes";
import { generarUUID } from "@/lib/uuid";
import type { UnidadDetalle } from "@/types/unidad-detalle";
import useArchivosUnidad from "@/hooks/useArchivosUnidad";

interface Props {
  unidad: UnidadDetalle | null;
  onChange: (campo: keyof UnidadDetalle, valor: any) => void;
  onGuardar: () => void;
  onCancelar: () => void;
}

export default function UnidadForm({ unidad, onChange, onGuardar, onCancelar }: Props) {
  const nombreValido = Boolean(unidad?.nombreMaterial && unidad.nombreMaterial.trim())
  const { archivos: archivosPrevios, eliminar, mutate } = useArchivosUnidad(
    unidad?.materialId,
    unidad?.id,
  )

  const guardarLocal = () => {
    onGuardar()
    mutate()
  }

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
    const target = e.target as HTMLInputElement
    const { type, value, files, checked } = target
    let val: any = value
    if (type === 'checkbox') val = checked
    else if (type === 'file')
      val = files ? (campo === 'archivos' ? Array.from(files) : files[0]) : null
    else if (numericFields.includes(campo))
      val = value === '' ? null : Number(value)
    onChange(campo, val)
  }

  const handleFile = (campo: keyof UnidadDetalle) => (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    if (campo === 'archivos') {
      const idx = Number(e.target.dataset.index)
      const file = e.target.files?.[0] || null
      const arr = Array.from(unidad.archivos ?? [])
      if (file) {
        if (idx >= arr.length) arr.push(file)
        else arr[idx] = file
      }
      onChange('archivos', arr)
    } else {
      const files = e.target.files
      const val = files ? files[0] : null
      onChange(campo, val)
    }
  }

  if (!unidad) {
    return (
      <p className="text-sm text-[var(--dashboard-muted)]">Selecciona o crea una unidad.</p>
    )
  }

  return (
    <div className="space-y-4 overflow-y-auto p-2 max-h-[calc(100vh-8rem)]">
      <section className="space-y-2">
        <h3 className="font-semibold">Identificación y control</h3>
        <div>
        <label htmlFor="unidad-nombreMaterial" className="text-xs text-[var(--dashboard-muted)]">Nombre del material</label>
        <input
          id="unidad-nombreMaterial"
          value={unidad.nombreMaterial ?? ''}
          onChange={handle('nombreMaterial')}
          autoFocus
          required
          className="dashboard-input no-drag w-full mt-1"
        />
        {!nombreValido && (
          <p className="text-xs text-red-500">Requerido</p>
        )}
        </div>
        <div>
        <label htmlFor="unidad-internoId" className="text-xs text-[var(--dashboard-muted)]">ID interno</label>
        <input
          id="unidad-internoId"
          value={unidad.internoId ?? ""}
          onChange={handle("internoId")}
          className="dashboard-input no-drag w-full mt-1"
        />
        </div>
        <div>
        <label htmlFor="unidad-serie" className="text-xs text-[var(--dashboard-muted)]">Número de serie</label>
        <input
          id="unidad-serie"
          value={unidad.serie ?? ""}
          onChange={handle("serie")}
          className="dashboard-input no-drag w-full mt-1"
        />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="unidad-codigoBarra" className="text-xs text-[var(--dashboard-muted)]">Código de barras</label>
            <input
              id="unidad-codigoBarra"
              value={unidad.codigoBarra ?? ""}
              onChange={handle("codigoBarra")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
          <div>
          <label htmlFor="unidad-codigoQR" className="text-xs text-[var(--dashboard-muted)]">Código QR</label>
          <input
            id="unidad-codigoQR"
            value={unidad.codigoQR ?? ""}
            onChange={handle("codigoQR")}
            className="dashboard-input no-drag w-full mt-1"
          />
          <MaterialCodes
            value={unidad}
            tipo="unidad"
            codigo={unidad.codigoQR || ''}
            onRegenerate={() => onChange('codigoQR', generarUUID())}
          />
        </div>
        </div>
        <div>
        <label htmlFor="unidad-lote" className="text-xs text-[var(--dashboard-muted)]">Lote</label>
        <input
          id="unidad-lote"
          value={unidad.lote ?? ""}
          onChange={handle("lote")}
          className="dashboard-input no-drag w-full mt-1"
        />
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Medición y propiedades físicas</h3>
        <div>
        <label htmlFor="unidad-medida" className="text-xs text-[var(--dashboard-muted)]">Unidad de medida</label>
        <input
          id="unidad-medida"
          value={unidad.unidadMedida ?? ""}
          onChange={handle("unidadMedida")}
          className="dashboard-input no-drag w-full mt-1"
        />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="unidad-peso" className="text-xs text-[var(--dashboard-muted)]">Peso</label>
            <input
              id="unidad-peso"
              type="number"
              value={unidad.peso ?? ""}
              onChange={handle("peso")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
          <div>
            <label htmlFor="unidad-volumen" className="text-xs text-[var(--dashboard-muted)]">Volumen</label>
            <input
              id="unidad-volumen"
              type="number"
              value={unidad.volumen ?? ""}
              onChange={handle("volumen")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label htmlFor="unidad-alto" className="text-xs text-[var(--dashboard-muted)]">Alto</label>
            <input
              id="unidad-alto"
              type="number"
              value={unidad.alto ?? ""}
              onChange={handle("alto")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
          <div>
            <label htmlFor="unidad-largo" className="text-xs text-[var(--dashboard-muted)]">Largo</label>
            <input
              id="unidad-largo"
              type="number"
              value={unidad.largo ?? ""}
              onChange={handle("largo")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
          <div>
            <label htmlFor="unidad-ancho" className="text-xs text-[var(--dashboard-muted)]">Ancho</label>
            <input
              id="unidad-ancho"
              type="number"
              value={unidad.ancho ?? ""}
              onChange={handle("ancho")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
        </div>
        <div>
        <label htmlFor="unidad-color" className="text-xs text-[var(--dashboard-muted)]">Color</label>
        <input
          id="unidad-color"
          value={unidad.color ?? ""}
          onChange={handle("color")}
          className="dashboard-input no-drag w-full mt-1"
        />
        </div>
        <div>
        <label htmlFor="unidad-temperatura" className="text-xs text-[var(--dashboard-muted)]">Temperatura ideal</label>
        <input
          id="unidad-temperatura"
          value={unidad.temperatura ?? ""}
          onChange={handle("temperatura")}
          className="dashboard-input no-drag w-full mt-1"
        />
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Estado y ubicación</h3>
        <div>
        <label htmlFor="unidad-estado" className="text-xs text-[var(--dashboard-muted)]">Estado</label>
        <select
          id="unidad-estado"
          value={unidad.estado ?? ''}
          onChange={handle('estado')}
          className="dashboard-select no-drag w-full mt-1"
        >
          <option value="">-</option>
          <option value="pendiente">pendiente</option>
          <option value="transito">transito</option>
          <option value="confirmado">confirmado</option>
        </select>
        </div>
        <div>
        <label htmlFor="unidad-ubicacionExacta" className="text-xs text-[var(--dashboard-muted)]">Ubicación exacta</label>
        <input
          id="unidad-ubicacionExacta"
          value={unidad.ubicacionExacta ?? ""}
          onChange={handle("ubicacionExacta")}
          className="dashboard-input no-drag w-full mt-1"
        />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="unidad-area" className="text-xs text-[var(--dashboard-muted)]">Área o zona</label>
            <input
              id="unidad-area"
              value={unidad.area ?? ""}
              onChange={handle("area")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
          <div>
            <label htmlFor="unidad-subcategoria" className="text-xs text-[var(--dashboard-muted)]">Subcategoría</label>
            <input
              id="unidad-subcategoria"
              value={unidad.subcategoria ?? ""}
              onChange={handle("subcategoria")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
        </div>
        <div>
        <label htmlFor="unidad-riesgo" className="text-xs text-[var(--dashboard-muted)]">Riesgo</label>
        <input
          id="unidad-riesgo"
          value={unidad.riesgo ?? ""}
          onChange={handle("riesgo")}
          className="dashboard-input no-drag w-full mt-1"
        />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="unidad-disponible"
            type="checkbox"
            checked={unidad.disponible ?? false}
            onChange={handle("disponible")}
          />
          <label htmlFor="unidad-disponible" className="text-xs text-[var(--dashboard-muted)]">Disponible</label>
        </div>
        <div>
        <label htmlFor="unidad-asignadoA" className="text-xs text-[var(--dashboard-muted)]">Asignado a</label>
        <input
          id="unidad-asignadoA"
          value={unidad.asignadoA ?? ""}
          onChange={handle("asignadoA")}
          className="dashboard-input no-drag w-full mt-1"
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
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Última modificación</label>
            <input
              type="date"
              value={unidad.fechaModificacion ?? ""}
              onChange={handle("fechaModificacion")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Caducidad</label>
            <input
              type="date"
              value={unidad.fechaCaducidad ?? ""}
              onChange={handle("fechaCaducidad")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Última inspección</label>
            <input
              type="date"
              value={unidad.fechaInspeccion ?? ""}
              onChange={handle("fechaInspeccion")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
          <div>
            <label className="text-xs text-[var(--dashboard-muted)]">Fecha de baja</label>
            <input
              type="date"
              value={unidad.fechaBaja ?? ""}
              onChange={handle("fechaBaja")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Responsable y uso</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="unidad-responsableIngreso" className="text-xs text-[var(--dashboard-muted)]">Responsable del ingreso</label>
            <input
              id="unidad-responsableIngreso"
              value={unidad.responsableIngreso ?? ""}
              onChange={handle("responsableIngreso")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
          <div>
            <label htmlFor="unidad-modificadoPor" className="text-xs text-[var(--dashboard-muted)]">Modificado por</label>
            <input
              id="unidad-modificadoPor"
              value={unidad.modificadoPor ?? ""}
              onChange={handle("modificadoPor")}
              className="dashboard-input no-drag w-full mt-1"
            />
          </div>
        </div>
        <div>
        <label htmlFor="unidad-proyecto" className="text-xs text-[var(--dashboard-muted)]">Proyecto asociado</label>
        <input
          id="unidad-proyecto"
          value={unidad.proyecto ?? ""}
          onChange={handle("proyecto")}
          className="dashboard-input no-drag w-full mt-1"
        />
        </div>
        <div>
        <label htmlFor="unidad-observaciones" className="text-xs text-[var(--dashboard-muted)]">Observaciones</label>
        <textarea
          id="unidad-observaciones"
          value={unidad.observaciones ?? ""}
          onChange={handle("observaciones")}
          className="dashboard-input no-drag w-full mt-1"
        />
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-semibold">Extras</h3>
        <div>
          <label htmlFor="unidad-imagen" className="text-xs text-[var(--dashboard-muted)]">Imagen</label>
          <input
            id="unidad-imagen"
            type="file"
            onChange={handleFile('imagen')}
            className="dashboard-input no-drag w-full mt-1"
          />
          {(unidad.imagen || unidad.imagenUrl) && (
            <div className="mt-2 flex items-start gap-2">
              <img
                src={
                  unidad.imagen instanceof File
                    ? URL.createObjectURL(unidad.imagen)
                    : typeof unidad.imagen === 'string'
                      ? unidad.imagen
                      : unidad.imagenUrl ?? undefined
                }
                alt="preview"
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => onChange('imagen', null)}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded"
              >
                Quitar
              </button>
            </div>
          )}
        </div>
        <div>
          <label htmlFor="unidad-archivos" className="text-xs text-[var(--dashboard-muted)]">Archivos adjuntos</label>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {unidad.archivos?.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                {f.type.startsWith('image/') && (
                  <img
                    src={URL.createObjectURL(f)}
                    alt="preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  data-index={i}
                  onChange={handleFile('archivos')}
                  className="dashboard-input no-drag flex-1"
                />
                <span className="flex-1 truncate text-xs">{f.name}</span>
                <button
                  type="button"
                  onClick={() =>
                    onChange('archivos', unidad.archivos!.filter((_, idx) => idx !== i))
                  }
                  className="px-1 py-0.5 bg-red-600 text-white text-xs rounded"
                >
                  Quitar
                </button>
              </div>
            ))}
            {(!unidad.archivos || unidad.archivos.length < 10) && (
              <input
                type="file"
                data-index={unidad.archivos?.length || 0}
                onChange={handleFile('archivos')}
                className="dashboard-input no-drag w-full"
              />
            )}
          </div>
          {archivosPrevios.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm">
            {archivosPrevios.map((a) => (
                <li key={a.id} className="flex items-center gap-2">
                  {a.archivoNombre.match(/\.(png|jpe?g|gif|webp)$/i) && (
                    <img
                      src={`/api/materiales/${unidad.materialId}/unidades/${unidad.id}/archivos/${a.id}`}
                      alt={a.nombre}
                      className="w-12 h-12 object-cover rounded"
                    />
                  )}
                  <span className="flex-1 truncate">{a.nombre}</span>
                  <a
                    href={`/api/materiales/${unidad.materialId}/unidades/${unidad.id}/archivos/${a.id}`}
                    download={a.nombre}
                    className="px-1 py-0.5 bg-blue-600 text-white text-xs rounded"
                  >
                    Descargar
                  </a>
                  <button
                    type="button"
                    onClick={() => eliminar(a.id)}
                    className="px-1 py-0.5 bg-red-600 text-white text-xs rounded"
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <div className="flex gap-2 pt-2">
        <button
          onClick={guardarLocal}
          disabled={!nombreValido}
          className="px-4 py-2 rounded-lg bg-[var(--dashboard-accent)] text-black text-sm hover:bg-[var(--dashboard-accent-hover)] disabled:opacity-50"
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

