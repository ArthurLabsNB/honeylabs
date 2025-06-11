"use client";
import type { Material } from "../components/MaterialRow";
import useMovimientosMaterial from "@/hooks/useMovimientosMaterial";
import useHistorialMaterial from "@/hooks/useHistorialMaterial";
import { useState } from "react";

interface Props {
  material: Material | null;
}

interface Registro {
  id: string;
  tipo: string;
  cantidad?: number | null;
  fecha: string;
  descripcion?: string | null;
  usuario?: string;
}

export default function HistorialMovimientosPanel({ material }: Props) {
  const { movimientos } = useMovimientosMaterial(material?.dbId);
  const { historial } = useHistorialMaterial(material?.dbId);
  const [detalle, setDetalle] = useState<Registro | null>(null);

  const registros: Registro[] = [
    ...historial.map((h) => ({
      id: `h-${h.id}`,
      tipo: h.descripcion?.startsWith('Entrada')
        ? 'entrada'
        : h.descripcion?.startsWith('Eliminacion')
          ? 'eliminacion'
          : 'modificacion',
      cantidad: h.cantidad,
      fecha: h.fecha,
      descripcion: h.descripcion ?? undefined,
      usuario: h.usuario?.nombre,
    })),
    ...movimientos.map((m) => ({
      id: `m-${m.id}`,
      tipo: m.tipo,
      cantidad: m.cantidad,
      fecha: m.fecha,
      descripcion: m.descripcion ?? undefined,
      usuario: m.usuario?.nombre,
    })),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  return (
    <div className="p-4 border rounded-md space-y-2">
      <h2 className="font-semibold">Historial / Movimientos</h2>
      <ul className="space-y-1 max-h-96 overflow-y-auto">
        {registros.map((r) => (
          <li
            key={r.id}
            className="p-1 rounded-md bg-white/5 cursor-pointer"
            onClick={() => setDetalle(r)}
          >
            <span className="mr-2">
              {r.tipo === 'entrada'
                ? '➕'
                : r.tipo === 'salida'
                  ? '➖'
                  : r.tipo === 'eliminacion'
                    ? '🗑'
                    : '✏'}
            </span>
            <span className="font-medium mr-2">{material?.nombre}</span>
            <span className="mr-2">{r.descripcion}</span>
            {r.cantidad != null && <span className="mr-2">{r.cantidad}</span>}
            <span className="mr-2">{new Date(r.fecha).toLocaleDateString()}</span>
            {r.usuario && <span className="text-xs">{r.usuario}</span>}
          </li>
        ))}
      </ul>
      {detalle && (
        <div className="text-xs bg-white/5 p-2 rounded-md">
          {detalle.descripcion || "Sin detalles"}
        </div>
      )}
    </div>
  );
}
