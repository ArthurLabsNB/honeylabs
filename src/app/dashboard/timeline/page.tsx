"use client";
import { useEffect, useState } from "react";
import Spinner from "@/components/Spinner";
import Badge from '@/components/Badge'
import { parseObservaciones } from '@/lib/parseObservaciones'
import { apiFetch } from "@lib/api";

interface Evento {
  id: number;
  fecha: string;
  observaciones: string | null;
  categoria?: string;
  version?: number;
  usuario?: { nombre: string } | null;
  almacen?: { nombre: string } | null;
  material?: { nombre: string } | null;
  unidad?: { nombre: string } | null;
}

export default function TimelinePage() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(true);
  const [activo, setActivo] = useState<number | null>(null);

  useEffect(() => {
    apiFetch("/api/auditorias")
      .then((r) => r.json())
      .then((d) => {
        setEventos(d.auditorias || []);
        setCargando(false);
      });
  }, []);

  if (cargando)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 space-y-4" data-oid="timeline-root">
      <h1 className="text-2xl font-bold">Historial</h1>
      <ul className="relative border-l border-white/20 ml-3 space-y-4">
        {eventos.map((e) => (
          <li
            key={e.id}
            className="ml-4 pl-2 cursor-pointer"
            onClick={() => setActivo(e.id === activo ? null : e.id)}
          >
            <div className="absolute -left-3 w-2 h-2 bg-[var(--dashboard-accent)] rounded-full" />
            <div className="text-sm flex justify-between">
              <span>
                {e.almacen?.nombre || e.material?.nombre || e.unidad?.nombre || "Evento"}
              </span>
              <span className="text-xs opacity-75">
                {new Date(e.fecha).toLocaleString()}
              </span>
            </div>
            {activo === e.id && (
              <div className="mt-1 text-xs space-y-1">
                {e.observaciones && (
                  <div className="flex flex-wrap items-center gap-1">
                    {e.categoria === 'modificacion'
                      ? (() => {
                          const obj = parseObservaciones(e.observaciones)
                          return obj
                            ? Object.keys(obj).map((k) => (
                                <Badge key={k}>{k}</Badge>
                              ))
                            : e.observaciones
                        })()
                      : e.observaciones}
                  </div>
                )}
                {e.version != null && <div>Versión: {e.version}</div>}
                {e.usuario?.nombre && <div>Usuario: {e.usuario.nombre}</div>}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
