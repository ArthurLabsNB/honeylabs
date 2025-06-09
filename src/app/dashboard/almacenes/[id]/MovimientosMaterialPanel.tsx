"use client";
import type { Material } from "../components/MaterialRow";
import useMovimientosMaterial from "@/hooks/useMovimientosMaterial";

export default function MovimientosMaterialPanel({
  material,
}: {
  material: Material | null;
}) {
  const { movimientos, loading, error } = useMovimientosMaterial(material?.dbId);

  return (
    <div className="p-4 border rounded-md space-y-2 md:col-span-2">
      <h2 className="font-semibold">Movimientos del material</h2>
      {loading ? (
        <p className="text-sm text-[var(--dashboard-muted)]">Cargando...</p>
      ) : error ? (
        <p className="text-sm text-red-500">Error al cargar</p>
      ) : (
        <ul className="space-y-1 max-h-32 overflow-y-auto">
          {movimientos.map((m) => (
            <li key={m.id} className="p-1 rounded-md bg-white/5">
              <span className="font-medium">{m.tipo}</span> - {m.cantidad} -{' '}
              {new Date(m.fecha).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
