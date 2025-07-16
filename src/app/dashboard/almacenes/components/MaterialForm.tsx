"use client";
import { ChangeEvent, useCallback, useState } from "react";
import { useToast } from "@/components/Toast";
import ImageModal from "@/components/ImageModal";
import useObjectUrl from "@/hooks/useObjectUrl";

const MAX_FILE_MB = 20;
import type { Material } from "./MaterialRow";
import MaterialCodes from "./MaterialCodes";
import { generarUUID } from "@/lib/uuid";
import useUnidades from "@/hooks/useUnidades";
import useArchivosMaterial from "@/hooks/useArchivosMaterial";

function FileThumb({ file, onClick }: { file: File; onClick: (url: string) => void }) {
  const url = useObjectUrl(file);
  if (!url || !file.type.startsWith('image/')) return null;
  return (
    <img
      src={url}
      alt="preview"
      className="w-12 h-12 object-cover rounded cursor-pointer"
      onClick={() => onClick(url)}
    />
  );
}

interface Props {
  material: Material | null;
  onChange: (campo: keyof Material, valor: any) => void;
  onGuardar: () => void;
  onCancelar: () => void;
  onDuplicar: () => void;
  onEliminar: () => void;
  readOnly?: boolean;
  historialInfo?: { fecha: string; usuario?: { nombre: string }; estado: any };
}

export default function MaterialForm({
  material,
  onChange,
  onGuardar,
  onCancelar,
  onDuplicar,
  onEliminar,
  readOnly = false,
  historialInfo,
}: Props) {
  if (!material) return null;

  const toast = useToast();
  const [preview, setPreview] = useState<string | null>(null);
  const { unidades } = useUnidades(material.dbId);
  const {
    archivos: archivosPreviosHook,
    eliminar,
    mutate,
  } = useArchivosMaterial(material.dbId);
  const miniaturaFileUrl = useObjectUrl(
    material.miniatura instanceof File ? material.miniatura : undefined,
  );
  const miniaturaSrc =
    material.miniatura instanceof File
      ? miniaturaFileUrl
      : typeof material.miniatura === 'string'
        ? material.miniatura
        : (material.miniaturaUrl as string | null);
  const archivosPrevios = readOnly && Array.isArray(material.archivos)
    ? (material.archivos as any[]).map((a, i) => ({ ...a, id: i }))
    : archivosPreviosHook;

  const guardar = useCallback(() => {
    onGuardar();
    mutate();
  }, [onGuardar, mutate]);

  const mostrarHistorial = (campo: keyof Material) => () => {
    if (!historialInfo) return;
    const valor = historialInfo.estado?.[campo as any];
    const usuario = historialInfo.usuario?.nombre || 'desconocido';
    const fecha = new Date(historialInfo.fecha).toLocaleString();
    toast.show(`Último cambio por ${usuario} el ${fecha}${valor !== undefined ? `, valor: ${valor}` : ''}`);
  };


  const numericFields: Array<keyof Material> = ['cantidad', 'minimo', 'maximo'];
  const dateFields: Array<keyof Material> = ['fechaCaducidad'];

  const handle = useCallback(
    (campo: keyof Material) => (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
      if (numericFields.includes(campo)) {
        const val = e.target.value;
        const num = val === '' ? (campo === 'cantidad' ? 0 : null) : Number(val);
        onChange(campo, Number.isNaN(num) ? (campo === 'cantidad' ? 0 : null) : num);
        return;
      }
      if (dateFields.includes(campo)) {
        onChange(campo, e.target.value || null);
        return;
      }
      if (campo === 'unidad' || campo === 'estado') {
        onChange(campo, e.target.value || null);
        return;
      }
      if (campo === 'miniatura') {
        onChange(campo, (e.target as HTMLInputElement).files?.[0] || null);
        return;
      }
      if (campo === 'archivos') {
        const idx = Number((e.target as HTMLInputElement).dataset.index);
        const file = (e.target as HTMLInputElement).files?.[0] || null;
        const arr = Array.from(material.archivos ?? []);
        if (file) {
          if (file.size > MAX_FILE_MB * 1024 * 1024) {
            toast.show(`Archivo demasiado grande: ${file.name}`, 'error');
            return;
          }
          if (idx >= arr.length) arr.push(file);
          else arr[idx] = file;
        }
        onChange('archivos', arr);
        return;
      }
      onChange(campo, e.target.value || null);
    },
    [material.archivos, onChange, toast],
  );

  return (
    <>
      <div className="space-y-3">
      <div>
        <label htmlFor="material-nombre" className="text-xs text-[var(--dashboard-muted)] flex items-center gap-1">
          Nombre
          {readOnly && historialInfo && (
            <button type="button" onClick={mostrarHistorial('nombre')} className="no-drag text-[var(--dashboard-muted)]">🕓</button>
          )}
        </label>
        <input
          id="material-nombre"
          value={material.nombre ?? ""}
          onChange={handle("nombre")}
          className="dashboard-input no-drag w-full mt-1"
          readOnly={readOnly}
        />
      </div>
      <div>
        <label htmlFor="material-descripcion" className="text-xs text-[var(--dashboard-muted)] flex items-center gap-1">
          Descripción
          {readOnly && historialInfo && (
            <button type="button" onClick={mostrarHistorial('descripcion')} className="no-drag text-[var(--dashboard-muted)]">🕓</button>
          )}
        </label>
        <textarea
          id="material-descripcion"
          value={material.descripcion ?? ""}
          onChange={handle("descripcion")}
          className="dashboard-input no-drag w-full mt-1"
          readOnly={readOnly}
        />
      </div>
      <div>
        <label htmlFor="material-num-unidades" className="text-xs text-[var(--dashboard-muted)]">Número de unidades</label>
        <input
          id="material-num-unidades"
          value={unidades.length}
          readOnly
          className="dashboard-input no-drag w-full mt-1"
        />
      </div>
      <div>
        <label htmlFor="material-unidad" className="text-xs text-[var(--dashboard-muted)]">Unidad de medida base</label>
        <select
          id="material-unidad"
          value={material.unidad ?? ''}
          onChange={handle('unidad')}
          className="dashboard-select no-drag w-full mt-1"
          disabled={readOnly}
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
        <label htmlFor="material-ubicacion" className="text-xs text-[var(--dashboard-muted)] flex items-center gap-1">
          Ubicación
          {readOnly && historialInfo && (
            <button type="button" onClick={mostrarHistorial('ubicacion')} className="no-drag text-[var(--dashboard-muted)]">🕓</button>
          )}
        </label>
        <input
          id="material-ubicacion"
          value={material.ubicacion ?? ""}
          onChange={handle("ubicacion")}
          className="dashboard-input no-drag w-full mt-1"
          readOnly={readOnly}
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="material-codigo-barra" className="text-xs text-[var(--dashboard-muted)]">Código de barras</label>
          <input
            id="material-codigo-barra"
            value={material.codigoBarra ?? ""}
            onChange={handle("codigoBarra")}
            className="dashboard-input no-drag w-full mt-1"
            readOnly={readOnly}
          />
        </div>
        <div>
          <label htmlFor="material-codigo-qr" className="text-xs text-[var(--dashboard-muted)]">Código QR</label>
          <input
            id="material-codigo-qr"
            value={material.codigoQR ?? ""}
            onChange={handle("codigoQR")}
            className="dashboard-input no-drag w-full mt-1"
            readOnly={readOnly}
          />
        </div>
      </div>
      <div>
        <label htmlFor="material-estado" className="text-xs text-[var(--dashboard-muted)]">Estado</label>
        <select
          id="material-estado"
          value={material.estado ?? ''}
          onChange={handle('estado')}
          className="dashboard-select no-drag w-full mt-1"
          disabled={readOnly}
        >
          <option value="">-</option>
          <option value="pendiente">pendiente</option>
          <option value="transito">transito</option>
          <option value="confirmado">confirmado</option>
        </select>
      </div>
      {/*
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Mínimo</label>
          <input
            type="number"
            value={material.minimo ?? ""}
            onChange={handle("minimo")}
            className="dashboard-input no-drag w-full mt-1"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Máximo</label>
          <input
            type="number"
            value={material.maximo ?? ""}
            onChange={handle("maximo")}
            className="dashboard-input no-drag w-full mt-1"
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
          className="dashboard-input no-drag w-full mt-1"
          readOnly={readOnly}
        />
      </div>
      <div>
        <label htmlFor="material-miniatura" className="text-xs text-[var(--dashboard-muted)]">Miniatura</label>
        <input
          id="material-miniatura"
          type="file"
          onChange={handle("miniatura") as any}
          className="dashboard-input no-drag w-full mt-1"
          disabled={readOnly}
        />
        {miniaturaSrc && (
          <div className="mt-2 flex items-start gap-2">
            <img
              src={miniaturaSrc}
              alt="miniatura"
              className="w-32 h-32 object-cover rounded cursor-pointer"
              onClick={() => setPreview(miniaturaSrc)}
            />
            <button
              type="button"
              onClick={() => onChange('miniatura', null)}
              className="px-2 py-1 bg-red-600 text-white text-xs rounded"
              disabled={readOnly}
            >
              Quitar
            </button>
          </div>
        )}
      </div>
      <div>
        <label htmlFor="material-archivos" className="text-xs text-[var(--dashboard-muted)]">Archivos adjuntos</label>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {material.archivos?.map((f, i) => (
            <div key={i} className="flex items-center gap-2">
              {f.type.startsWith('image/') && (
                <FileThumb file={f} onClick={(u) => setPreview(u)} />
              )}
              <input
                type="file"
                data-index={i}
                onChange={handle('archivos') as any}
                className="dashboard-input no-drag flex-1"
                disabled={readOnly}
              />
              <span className="flex-1 truncate text-xs">{f.name}</span>
              <button
                type="button"
                onClick={() =>
                  onChange('archivos', material.archivos!.filter((_, idx) => idx !== i))
                }
                className="px-1 py-0.5 bg-red-600 text-white text-xs rounded"
                disabled={readOnly}
              >
                Quitar
              </button>
            </div>
          ))}
          {!readOnly && (!material.archivos || material.archivos.length < 10) && (
            <input
              type="file"
              data-index={material.archivos?.length || 0}
              onChange={handle('archivos') as any}
              className="dashboard-input no-drag w-full"
            />
          )}
        </div>
        {archivosPrevios.length > 0 && (
          <ul className="mt-2 space-y-1 text-sm">
            {archivosPrevios.map((a) => (
              <li key={a.id} className="flex items-center gap-2">
                {readOnly && (a as any).archivo ? (
                  (a as any).archivoNombre.match(/\.(png|jpe?g|gif|webp)$/i) && (
                    <img
                      src={`data:image/*;base64,${(a as any).archivo}`}
                      alt={a.nombre}
                      className="w-12 h-12 object-cover rounded cursor-pointer"
                      onClick={() =>
                        setPreview(`data:image/*;base64,${(a as any).archivo}`)
                      }
                    />
                  )
                ) : a.archivoNombre.match(/\.(png|jpe?g|gif|webp)$/i) ? (
                  <img
                    src={`/api/materiales/${material.dbId}/archivos/${a.id}`}
                    alt={a.nombre}
                    className="w-12 h-12 object-cover rounded cursor-pointer"
                    onClick={() =>
                      setPreview(
                        `/api/materiales/${material.dbId}/archivos/${a.id}`
                      )
                    }
                  />
                ) : null}
                <span className="flex-1 truncate">{a.nombre}</span>
                <a
                  href={
                    readOnly && (a as any).archivo
                      ? `data:application/octet-stream;base64,${(a as any).archivo}`
                      : `/api/materiales/${material.dbId}/archivos/${a.id}`
                  }
                  download={a.nombre}
                  className="px-1 py-0.5 bg-blue-600 text-white text-xs rounded"
                >
                  Descargar
                </a>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => eliminar(a.id)}
                    className="px-1 py-0.5 bg-red-600 text-white text-xs rounded"
                  >
                    Quitar
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <MaterialCodes
        value={material.codigoQR || ''}
        onRegenerate={() => onChange('codigoQR', generarUUID())}
      />
      <div className="flex gap-2 pt-2">
        {readOnly ? (
          <button
            onClick={onCancelar}
            className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm"
          >
            Cerrar
          </button>
        ) : (
          <>
            <button
              onClick={guardar}
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
          </>
        )}
      </div>
      {preview && (
        <ImageModal src={preview} onClose={() => setPreview(null)} />
      )}
      </div>
    </>
  );
}
