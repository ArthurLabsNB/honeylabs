"use client";
import { memo, useCallback } from "react";

export interface Material {
  id?: number;
  producto: string;
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
  index: number;
  onChange: (idx: number, campo: keyof Material, valor: string | number) => void;
}

const MaterialRow = memo(function MaterialRow({ material, index, onChange }: Props) {
  const handleProducto = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(index, "producto", e.target.value),
    [index, onChange],
  );
  const handleCantidad = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(index, "cantidad", e.target.value),
    [index, onChange],
  );
  const handleLote = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      onChange(index, "lote", e.target.value),
    [index, onChange],
  );

  return (
    <tr className="border-t border-white/10">
      <td className="px-3 py-2">
        <input
          value={material.producto}
          onChange={handleProducto}
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
}, (prev, next) => prev.material === next.material && prev.index === next.index);

export default MaterialRow;
