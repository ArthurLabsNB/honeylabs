"use client";
import type { Material } from "@/app/dashboard/almacenes/components/MaterialRow";
import type { UnidadDetalle } from "@/types/unidad-detalle";

interface Props {
  material: Material | null;
  unidad: UnidadDetalle | null;
  onBack: () => void;
}

export default function Breadcrumbs({ material, unidad, onBack }: Props) {
  return (
    <nav className="text-xs text-[var(--dashboard-muted)] mb-2">
      <span>{material?.nombre || "Material"}</span>
      {unidad && (
        <>
          <span className="mx-1">/</span>
          <span>{unidad.nombre}</span>
          <button
            onClick={onBack}
            className="ml-2 underline text-blue-400"
          >
            volver al material
          </button>
        </>
      )}
    </nav>
  );
}
