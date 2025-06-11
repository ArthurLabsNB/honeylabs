"use client";
import { memo, useCallback } from "react";

export interface Material {
  /** Identificador único local */
  id: string;
  /** Identificador de base de datos */
  dbId?: number;
  nombre: string;
  cantidad: number;
  lote: string;
  descripcion?: string;
  fechaCaducidad?: string;
  ubicacion?: string;
  proveedor?: string;
  estado?: string;
  observaciones?: string;
  codigoBarra?: string;
  codigoQR?: string;
  unidad?: string;
  minimo?: number;
  maximo?: number;
  miniatura?: File | null;
  miniaturaNombre?: string | null;
  miniaturaUrl?: string | null;
  archivos?: File[];
  archivosPrevios?: { id: number; nombre: string; archivoNombre: string }[];
}

interface Props {
  id: string;
  material: Material;
  onChange: (id: string, campo: keyof Material, valor: string | number) => void;
}

const MaterialRow = memo(function MaterialRow({ id, material, onChange }: Props) {
  const handleNombre = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(id, "nombre", e.target.value),
    [id, onChange],
  );
  const handleCantidad = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(id, "cantidad", e.target.value),
    [id, onChange],
  );
  const handleLote = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(id, "lote", e.target.value),
    [id, onChange],
  );
  const handleEstado = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(id, "estado", e.target.value),
    [id, onChange],
  );
  const handleUbicacion = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(id, "ubicacion", e.target.value),
    [id, onChange],
  );

  return (
    <tr className="border-t border-white/10">
      <td className="px-3 py-2">
        <input
          value={material.nombre}
          onChange={handleNombre}
          className="bg-transparent w-full focus:outline-none"
        />
      </td>
      <td className="px-3 py-2">
        <input
          type="number"
          value={material.cantidad}
          onChange={handleCantidad}
          className="bg-transparent w-full focus:outline-none"
        />
      </td>
      <td className="px-3 py-2">
        <input
          value={material.lote}
          onChange={handleLote}
          className="bg-transparent w-full focus:outline-none"
        />
      </td>
      <td className="px-3 py-2">
        <input
          value={material.estado ?? ""}
          onChange={handleEstado}
          className="bg-transparent w-full focus:outline-none"
        />
      </td>
      <td className="px-3 py-2">
        <input
          value={material.ubicacion ?? ""}
          onChange={handleUbicacion}
          className="bg-transparent w-full focus:outline-none"
        />
      </td>
    </tr>
  );
}, (prev, next) =>
  prev.id === next.id &&
  prev.material.nombre === next.material.nombre &&
  prev.material.cantidad === next.material.cantidad &&
  prev.material.lote === next.material.lote &&
  prev.material.estado === next.material.estado &&
  prev.material.ubicacion === next.material.ubicacion,
);

export default MaterialRow;
