"use client";
import type { Material } from "../components/MaterialRow";
import useMovimientosMaterial from "@/hooks/useMovimientosMaterial";
import useHistorialMaterial from "@/hooks/useHistorialMaterial";
import { useState, useMemo } from "react";

interface Props {
  material: Material | null;
  onSelectHistorial?: (estado: any) => void;
}

interface Registro {
  id: string;
  tipo: string;
  cantidad?: number | null;
  fecha: string;
  descripcion?: string | null;
  usuario?: string;
  estado?: any;
}

export default function HistorialMovimientosPanel({ material, onSelectHistorial }: Props) {
  const { movimientos } = useMovimientosMaterial(material?.dbId);
  const { historial } = useHistorialMaterial(material?.dbId);
  const [detalle, setDetalle] = useState<Registro | null>(null);
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState<'todos' | 'entrada' | 'salida' | 'modificacion' | 'eliminacion'>('todos');

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
      estado: h.estado,
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

  const filtrados = useMemo(
    () =>
      registros.filter(
        (r) =>
          (tipo === 'todos' || r.tipo === tipo) &&
          (busqueda === '' ||
            r.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
            r.usuario?.toLowerCase().includes(busqueda.toLowerCase())),
      ),
    [registros, busqueda, tipo],
  );

  return (
    <div className="p-4 border rounded-md space-y-2">
      <h2 className="font-semibold">Historial / Movimientos</h2>
      <div className="flex gap-2">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar"
          className="dashboard-input flex-1"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as any)}
          className="dashboard-input"
        >
          <option value="todos">Todos</option>
          <option value="entrada">Entradas</option>
          <option value="salida">Salidas</option>
          <option value="modificacion">Modificaciones</option>
          <option value="eliminacion">Eliminaciones</option>
        </select>
      </div>
      <ul className="space-y-1 max-h-96 overflow-y-auto">
        {filtrados.map((r) => (
          <li
            key={r.id}
            className="p-1 rounded-md bg-white/5 cursor-pointer"
            onClick={() => {
              setDetalle(r);
              if (r.estado && onSelectHistorial) onSelectHistorial(r.estado);
            }}
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
