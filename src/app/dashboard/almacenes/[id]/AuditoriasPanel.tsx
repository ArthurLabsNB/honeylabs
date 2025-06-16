"use client";
import type { Material } from "../components/MaterialRow";
import useMovimientosMaterial from "@/hooks/useMovimientosMaterial";
import useHistorialMaterial from "@/hooks/useHistorialMaterial";
import useMovimientos from "@/hooks/useMovimientos";
import useHistorialAlmacen from "@/hooks/useHistorialAlmacen";
import useHistorialUnidad from "@/hooks/useHistorialUnidad";
import { useState, useMemo } from "react";
import Link from "next/link";
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
  almacenId?: number;
  unidadId?: number;
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
  fuente: 'material' | 'unidad';
}

export default function HistorialMovimientosPanel({ material, almacenId, unidadId, onSelectHistorial }: Props) {
  const { movimientos } = useMovimientosMaterial(material?.dbId);
  const { historial } = useHistorialMaterial(material?.dbId);
  const { movimientos: movimientosAlmacen } = useMovimientos(almacenId);
  const { historial: historialAlmacen } = useHistorialAlmacen(almacenId);
  const { historial: historialUnidad } = useHistorialUnidad(material?.dbId, unidadId);
  const [detalle, setDetalle] = useState<any | null>(null);
  const [activo, setActivo] = useState<string | null>(null);
  const toast = useToast();
  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState<'todos' | 'entrada' | 'salida' | 'creacion' | 'modificacion' | 'eliminacion'>('todos');

  const registros: Registro[] = [
    ...(!material
      ? historial.map((h) => ({
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
          fuente: 'material',
        }))
      : []),
    ...historialUnidad.map((h) => ({
      id: `hu-${h.id}`,
      tipo: h.descripcion?.startsWith('Eliminacion')
        ? 'eliminacion'
        : h.descripcion?.startsWith('Creacion')
          ? 'creacion'
          : 'modificacion',
      fecha: h.fecha,
      descripcion: h.descripcion ?? undefined,
      estado: h.estado,
      usuario: h.usuario?.nombre,
      fuente: 'unidad',
    })),
    ...(!material
      ? movimientos.map((m) => ({
          id: `m-${m.id}`,
          tipo: m.tipo,
          cantidad: m.cantidad,
          fecha: m.fecha,
          descripcion: m.descripcion ?? undefined,
          usuario: m.usuario?.nombre,
          fuente: 'material',
        }))
      : []),
  ].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const buscarEstado = (
    fuente: 'material' | 'unidad',
    fecha: string,
    descripcion?: string,
  ) => {
    const hist =
      fuente === 'material'
        ? historial
        : historialUnidad;
    const target = hist.find(
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
      const estado = buscarEstado('material', registro.fecha, registro.descripcion);
      if (estado) {
        const entry = { ...registro, estado } as any;
        setDetalle({ ...entry, id });
        onSelectHistorial && onSelectHistorial(entry);
      } else {
        toast.show('Este movimiento no tiene datos disponibles.', 'error');
      }
    } else if (pref === 'hu') {
      try {
        const res = await fetch(`/api/historial/unidad/${real}`);
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
    }
  };

  return (
    <div className="p-4 border rounded-md space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Auditorías</h2>
        <Link href="/dashboard/auditorias" className="text-sm underline">
          Ver todas
        </Link>
      </div>
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
          <option value="creacion">Creaciones</option>
          <option value="modificacion">Modificaciones</option>
          <option value="eliminacion">Eliminaciones</option>
        </select>
      </div>
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {filtrados.map((r) => (
          <li
            key={r.id}
            className={`dashboard-card cursor-pointer space-y-1 ${
              activo === r.id
                ? 'border-[var(--dashboard-accent)]'
                : 'hover:border-[var(--dashboard-accent)]'
            }`}
            onClick={() => handleClickMovimiento(r.id)}
          >
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="inline-block w-4 h-4">
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
                <span className="font-medium">
                  {r.fuente === 'material'
                    ? material?.nombre
                    : r.fuente === 'unidad'
                      ? 'Unidad'
                      : 'Almacén'}
                </span>
              </span>
              <span className="text-xs">
                {new Date(r.fecha).toLocaleString()}
              </span>
            </div>
            <div className="text-xs">
              <span>{r.descripcion}</span>
              {r.cantidad != null && <span className="ml-2">Cant: {r.cantidad}</span>}
              {r.usuario && <span className="ml-2">Por: {r.usuario}</span>}
            </div>
          </li>
        ))}
      </ul>
      {detalle && (
        <div className="text-xs dashboard-card space-y-2">
          {(detalle.fuente === 'material' || detalle.fuente === 'unidad') &&
            detalle.estado?.codigoQR && (
            <MaterialCodes value={detalle.estado.codigoQR} />
          )}
          <div>{detalle.descripcion || "Sin detalles"}</div>
        </div>
      )}
    </div>
  );
}
