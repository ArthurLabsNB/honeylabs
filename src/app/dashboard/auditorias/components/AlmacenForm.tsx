"use client";

export default function AlmacenForm({ almacen }: { almacen: any }) {
  if (!almacen) return null;
  return (
    <div className="space-y-3 text-sm">
      <div>
        <label className="text-xs text-[var(--dashboard-muted)]">Nombre</label>
        <input
          className="dashboard-input w-full mt-1 no-drag"
          value={almacen.nombre ?? ""}
          readOnly
        />
      </div>
      {almacen.descripcion && (
        <div>
          <label className="text-xs text-[var(--dashboard-muted)]">Descripción</label>
          <textarea
            className="dashboard-input w-full mt-1 no-drag"
            value={almacen.descripcion ?? ""}
            readOnly
          />
        </div>
      )}
    </div>
  );
}
