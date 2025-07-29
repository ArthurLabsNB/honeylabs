"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import AuditoriaDetailNavbar from "../components/AuditoriaDetailNavbar";
import AuditoriaSummaryCard from "../components/AuditoriaSummaryCard";
import MaterialForm from "@/app/dashboard/almacenes/components/MaterialForm";
import UnidadForm from "@/app/dashboard/almacenes/components/UnidadForm";
import AlmacenForm from "../components/AlmacenForm";
import { AUDIT_TOGGLE_DIFF_EVENT } from "@/lib/ui-events";

export default function AuditoriaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [from, setFrom] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [historial, setHistorial] = useState<any[]>([]);
  const [diffIndexA, setDiffIndexA] = useState(-2);
  const [diffIndexB, setDiffIndexB] = useState(-1);
  const [diffData, setDiffData] = useState<{ prev: any; current: any } | null>(null);
  const [showDiff, setShowDiff] = useState(false);
  const estado = useMemo(() => {
    if (!data?.observaciones) return null;
    try {
      return JSON.parse(data.observaciones);
    } catch {
      return null;
    }
  }, [data?.observaciones]);
  const noop = () => {};

  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    setFrom(searchParams.get("from"));
  }, [searchParams]);

  useEffect(() => {
    const ctrl = new AbortController();
    if (!id) return;
    apiFetch(`/api/auditorias/${id}`, { signal: ctrl.signal })
      .then(jsonOrNull)
      .then((d) => {
        if (d?.auditoria) setData(d.auditoria);
      })
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [id]);

  useEffect(() => {
    if (!data) return;
    let url = '';
    if (data.tipo === 'almacen' && data.almacenId) {
      url = `/api/almacenes/${data.almacenId}/historial`;
    } else if (data.tipo === 'material' && data.materialId) {
      url = `/api/materiales/${data.materialId}/historial`;
    } else if (data.tipo === 'unidad' && data.materialId && data.unidadId) {
      url = `/api/materiales/${data.materialId}/unidades/${data.unidadId}/historial`;
    }
    if (!url) return;
    apiFetch(url)
      .then(jsonOrNull)
      .then((d) => {
        const h: any[] = d?.historial || [];
        setHistorial(h);
        if (h.length >= 2) {
          setDiffIndexA(h.length - 2);
          setDiffIndexB(h.length - 1);
        } else {
          setDiffIndexA(-1);
          setDiffIndexB(-1);
        }
      })
      .catch(() => {});
  }, [data]);

  useEffect(() => {
    if (diffIndexA < 0 || diffIndexB < 0) {
      setDiffData(null);
      return;
    }
    if (historial[diffIndexA] && historial[diffIndexB]) {
      setDiffData({ prev: historial[diffIndexA], current: historial[diffIndexB] });
    }
  }, [diffIndexA, diffIndexB, historial]);

  useEffect(() => {
    const handler = () => setShowDiff((v) => !v);
    window.addEventListener(AUDIT_TOGGLE_DIFF_EVENT, handler);
    return () => window.removeEventListener(AUDIT_TOGGLE_DIFF_EVENT, handler);
  }, []);

  const goBack = () => {
    if (from) router.push(from);
    else router.back();
  };

  if (loading)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );

  if (!data)
    return (
      <div className="p-4 space-y-2">
        <p className="text-red-500">No encontrado</p>
        <button onClick={goBack} className="underline text-sm">Volver</button>
      </div>
    );

  return (
    <>
      <AuditoriaDetailNavbar />
      <div className="p-4 space-y-4" style={{ paddingTop: 'var(--navbar-height)' }}>
        <AuditoriaSummaryCard auditoria={data} />
        <div className="dashboard-card text-xs space-y-1">
          {data.unidad?.nombre && <div>Unidad: {data.unidad.nombre}</div>}
          {data.material?.nombre && <div>Material: {data.material.nombre}</div>}
          {data.almacen?.nombre && <div>Almacén: {data.almacen.nombre}</div>}
          {data.observaciones && <div>{data.observaciones}</div>}
          {estado && (
            <div className="my-2">
              {data.tipo === 'material' && (
                <MaterialForm
                  material={estado}
                  onChange={noop}
                  onGuardar={noop}
                  onCancelar={noop}
                  onDuplicar={noop}
                  onEliminar={noop}
                  readOnly
                />
              )}
              {data.tipo === 'unidad' && (
                <UnidadForm
                  unidad={estado}
                  onChange={noop}
                  onGuardar={noop}
                  onCancelar={noop}
                  readOnly
                />
              )}
              {data.tipo === 'almacen' && <AlmacenForm almacen={estado} />}
            </div>
          )}
          {Array.isArray(data.archivos) && data.archivos.length > 0 && (
            <div className="mt-2 space-y-1">
              <h3 className="text-sm font-semibold">Archivos adjuntos</h3>
              <div className="flex flex-wrap gap-2">
                {data.archivos.map((a: any) => (
                  <a
                    key={a.id}
                    href={`/api/auditorias/${id}/archivos/${a.id}`}
                    className="border rounded p-1 text-xs hover:bg-white/10"
                    download
                    target="_blank"
                  >
                    {a.archivoNombre?.match(/\.(png|jpe?g|gif|webp)$/i) ? (
                      <img
                        src={`/api/auditorias/${id}/archivos/${a.id}`}
                        alt={a.nombre}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      a.nombre
                    )}
                  </a>
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
            className="px-2 py-1 rounded bg-white/10 text-xs"
          >
            Copiar
          </button>
          <button
            onClick={() => setShowDiff((v) => !v)}
            className="px-2 py-1 rounded bg-white/10 text-xs ml-2"
          >
            {showDiff ? 'Ocultar diff' : 'Comparar versiones'}
          </button>
          {showDiff && (
            <div className="mt-3 space-y-2">
              {historial.length >= 2 ? (
                <>
                  <div className="flex gap-2 text-xs">
                    <select
                      value={diffIndexA}
                      onChange={(e) => setDiffIndexA(Number(e.target.value))}
                      className="border p-1 rounded"
                    >
                      {historial.map((h, i) => (
                        <option key={i} value={i}>
                          {new Date(h.fecha).toLocaleString()}
                        </option>
                      ))}
                    </select>
                    <select
                      value={diffIndexB}
                      onChange={(e) => setDiffIndexB(Number(e.target.value))}
                      className="border p-1 rounded"
                    >
                      {historial.map((h, i) => (
                        <option key={i} value={i}>
                          {new Date(h.fecha).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  {diffData && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <pre className="p-2 bg-black/20 rounded overflow-auto whitespace-pre-wrap">
                        {JSON.stringify(diffData.prev.estado, null, 2)}
                      </pre>
                      <pre className="p-2 bg-black/20 rounded overflow-auto whitespace-pre-wrap">
                        {JSON.stringify(diffData.current.estado, null, 2)}
                      </pre>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-xs text-gray-400">No hay versiones suficientes.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
