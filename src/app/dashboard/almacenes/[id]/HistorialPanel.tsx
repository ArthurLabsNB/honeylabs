"use client";
import useMovimientos from "@/hooks/useMovimientos";

export default function HistorialPanel({ almacenId }: { almacenId: number }) {
  const { movimientos, loading, error } = useMovimientos(almacenId);

  return (
    <div className="p-4 border rounded-md space-y-2">
      <h2 className="font-semibold">Historial</h2>
      {loading ? (
        <p className="text-sm text-[var(--dashboard-muted)]">Cargando...</p>
      ) : error ? (
        <p className="text-sm text-red-500">Error al cargar</p>
      ) : (
        <ul className="space-y-1 max-h-32 overflow-y-auto">
          {movimientos.map((m) => (
            <li key={m.id} className="p-1 rounded-md bg-white/5">
              <span className="font-medium">{m.tipo}</span> - {m.cantidad} -
              {new Date(m.fecha).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
