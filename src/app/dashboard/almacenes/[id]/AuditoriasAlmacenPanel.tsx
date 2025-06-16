"use client";
import { useState, useMemo } from "react";
import useMovimientos from "@/hooks/useMovimientos";
import useHistorialAlmacen from "@/hooks/useHistorialAlmacen";
import { PlusIcon, MinusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/solid";

export default function HistorialAlmacenPanel({ almacenId }: { almacenId: number }) {
  const { movimientos } = useMovimientos(almacenId);
  const { historial } = useHistorialAlmacen(almacenId);
  const [detalle, setDetalle] = useState<any | null>(null);
  const [tipo, setTipo] = useState<'todos' | 'entrada' | 'salida' | 'creacion' | 'modificacion' | 'eliminacion'>('todos');

  const registros = useMemo(() =>
    movimientos.map(m => ({
      ...m,
      usuario: m.usuario?.nombre,
      estado: historial.find(h => Math.abs(new Date(h.fecha).getTime() - new Date(m.fecha).getTime()) < 5000 && (h.descripcion ?? '') === (m.descripcion ?? ''))?.estado,
    })), [movimientos, historial]);

  const filtrados = registros.filter(r => tipo === 'todos' || r.tipo === tipo);

  return (
    <div className="p-4 border rounded-md space-y-2">
      <h2 className="font-semibold">Auditorías del almacén</h2>
      <select value={tipo} onChange={e => setTipo(e.target.value as any)} className="dashboard-input">
        <option value="todos">Todos</option>
        <option value="creacion">Creación</option>
        <option value="modificacion">Modificaciones</option>
        <option value="entrada">Entradas</option>
        <option value="salida">Salidas</option>
        <option value="eliminacion">Eliminaciones</option>
      </select>
      <ul className="space-y-1 max-h-96 overflow-y-auto">
        {filtrados.map(r => (
          <li key={r.id} className="p-1 rounded-md bg-white/5 cursor-pointer" onClick={() => setDetalle(r)}>
            <span className="mr-2 inline-block w-4 h-4">
              {r.tipo === 'entrada' ? (
                <PlusIcon className="w-4 h-4" />
              ) : r.tipo === 'salida' ? (
                <MinusIcon className="w-4 h-4" />
              ) : r.tipo === 'eliminacion' ? (
                <TrashIcon className="w-4 h-4" />
              ) : (
                <PencilSquareIcon className="w-4 h-4" />
              )}
            </span>
            <span className="font-medium mr-2">{r.tipo}</span>
            {r.cantidad != null && <span className="mr-2">{r.cantidad}</span>}
            <span className="mr-2">{new Date(r.fecha).toLocaleDateString()}</span>
            {r.usuario && <span className="text-xs">{r.usuario}</span>}
          </li>
        ))}
      </ul>
      {detalle && (
        <div className="text-xs bg-white/5 p-2 rounded-md space-y-2">
          <pre>{JSON.stringify(detalle.estado, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
