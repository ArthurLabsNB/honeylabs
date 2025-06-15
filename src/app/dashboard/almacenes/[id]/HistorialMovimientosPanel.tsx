"use client";
import type { Material } from "../components/MaterialRow";
import useMovimientosMaterial from "@/hooks/useMovimientosMaterial";
import useHistorialMaterial from "@/hooks/useHistorialMaterial";
import { useState, useMemo } from "react";
import {
  PlusIcon,
  MinusIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { useToast } from "@/components/Toast";
import ExportNavbar from "../components/ExportNavbar";
import MaterialCodes from "../components/MaterialCodes";


interface Props {
  material: Material | null;
  onSelectHistorial?: (entry: any) => void;
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
  const [detalle, setDetalle] = useState<any | null>(null);
  const [activo, setActivo] = useState<string | null>(null);
  const toast = useToast();
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

  const buscarEstado = (fecha: string, descripcion?: string) => {
    const target = historial.find(
      (h) =>
        Math.abs(new Date(h.fecha).getTime() - new Date(fecha).getTime()) < 5000 &&
        (h.descripcion ?? '') === (descripcion ?? '')
    );
    return target?.estado;
  };

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

  const handleClickMovimiento = async (id: string) => {
    setActivo(id);
    const [pref, real] = id.split('-');
    if (pref === 'h') {
      try {
        const res = await fetch(`/api/historial/material/${real}`);
        const data = await res.json();
        if (data.entry?.estado) {
          setDetalle({ ...data.entry, id });
          onSelectHistorial && onSelectHistorial(data.entry);
        } else {
          toast.show('Este movimiento no tiene datos disponibles.', 'error');
        }
      } catch (err) {
        console.error(err);
        toast.show('Error al obtener movimiento.', 'error');
      }
    } else if (pref === 'm') {
      const registro = registros.find((r) => r.id === id);
      if (!registro) return;
      const estado = buscarEstado(registro.fecha, registro.descripcion);
      if (estado) {
        const entry = { ...registro, estado } as any;
        setDetalle({ ...entry, id });
        onSelectHistorial && onSelectHistorial(entry);
      } else {
        toast.show('Este movimiento no tiene datos disponibles.', 'error');
      }
    }
  };

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
            className={`p-1 rounded-md cursor-pointer ${activo === r.id ? 'bg-white/10' : 'bg-white/5 hover:bg-white/10'}`}
            onClick={() => handleClickMovimiento(r.id)}
          >
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
            <span className="font-medium mr-2">{material?.nombre}</span>
            <span className="mr-2">{r.descripcion}</span>
            {r.cantidad != null && <span className="mr-2">{r.cantidad}</span>}
            <span className="mr-2">{new Date(r.fecha).toLocaleDateString()}</span>
            {r.usuario && <span className="text-xs">{r.usuario}</span>}
          </li>
        ))}
      </ul>
      {detalle && (
        <div className="text-xs bg-white/5 p-2 rounded-md space-y-2">
          {detalle.estado?.codigoQR && (
            <MaterialCodes value={detalle.estado.codigoQR} />
          )}
          <div>{detalle.descripcion || "Sin detalles"}</div>
        </div>
      )}
    </div>
  );
}
