"use client";
import { useState } from "react";
import Link from "next/link";
import useAuditorias from "@/hooks/useAuditorias";

interface Props {
  material: { dbId: number; nombre: string } | null;
  almacenId?: number;
  unidadId?: number;
  onSelectHistorial?: (entry: any) => void;
}

export default function AuditoriasPanel({ material, almacenId, unidadId, onSelectHistorial }: Props) {
  const { auditorias } = useAuditorias({
    tipo: material ? "material" : unidadId ? "unidad" : "almacen",
    almacenId,
    materialId: material?.dbId,
    unidadId,
  });
  const [activo, setActivo] = useState<number | null>(null);

  return (
    <div className="p-4 border rounded-md space-y-2 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Auditorías</h2>
        <Link href="/dashboard/auditorias" className="text-sm underline">
          Ver todas
        </Link>
      </div>
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {auditorias.map((a) => (
          <li
            key={a.id}
            className={`dashboard-card space-y-1 cursor-pointer ${
              activo === a.id ? 'border-[var(--dashboard-accent)]' : 'hover:border-[var(--dashboard-accent)]'
            }`}
            onClick={() => {
              setActivo(a.id);
              onSelectHistorial && onSelectHistorial(a);
            }}
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">
                {a.almacen?.nombre || a.material?.nombre || a.unidad?.nombre || '-'}
              </span>
              <span className="text-xs">{new Date(a.fecha).toLocaleString()}</span>
            </div>
            <div className="text-xs">
              <span className="mr-2 font-semibold">{a.categoria || a.tipo}</span>
              {a.observaciones && <span>{a.observaciones}</span>}
            </div>
          </li>
        ))}
        {auditorias.length === 0 && (
          <li className="text-sm text-zinc-500">Sin registros</li>
        )}
      </ul>
    </div>
  );
}
