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
}

interface Props {
  material: Material;
  onChange: (id: string, campo: keyof Material, valor: string | number) => void;
}

const MaterialRow = memo(function MaterialRow({ material, onChange }: Props) {
  const handleNombre = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(material.id, "nombre", e.target.value),
    [material.id, onChange],
  );
  const handleCantidad = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(material.id, "cantidad", e.target.value),
    [material.id, onChange],
  );
  const handleLote = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(material.id, "lote", e.target.value),
    [material.id, onChange],
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
    </tr>
  );
}, (prev, next) => prev.material === next.material);

export default MaterialRow;
