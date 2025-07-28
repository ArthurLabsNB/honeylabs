"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import AuditoriaDetailNavbar from "../components/AuditoriaDetailNavbar";

export default function AuditoriaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [from, setFrom] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="p-4 space-y-4" style={{ paddingTop: 'calc(var(--navbar-height) * 2)' }}>
        <div className="dashboard-card text-xs space-y-1">
          <div>Tipo: {data.tipo}</div>
          {data.unidad?.nombre && <div>Unidad: {data.unidad.nombre}</div>}
          {data.material?.nombre && <div>Material: {data.material.nombre}</div>}
          {data.almacen?.nombre && <div>Almacén: {data.almacen.nombre}</div>}
          {data.observaciones && <div>{data.observaciones}</div>}
          <div>{new Date(data.fecha).toLocaleString()}</div>
          <pre className="overflow-auto bg-black/20 p-2 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(data))}
            className="px-2 py-1 rounded bg-white/10 text-xs"
          >
            Copiar
          </button>
        </div>
      </div>
    </>
  );
}
