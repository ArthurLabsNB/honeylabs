"use client";
import { useState } from "react";
import { puede, RolArea } from "@/lib/roles";

export default function RolesPage() {
  const [permisos, setPermisos] = useState<RolArea[]>(["lectura"]);
  const toggle = (p: RolArea) => {
    setPermisos((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  return (
    <div className="p-4 space-y-4" data-oid="roles-root">
      <h1 className="text-2xl font-bold">Roles Personalizados</h1>
      <div className="space-x-2">
        {(["lectura", "edicion", "comentarios"] as RolArea[]).map((r) => (
          <label key={r} className="inline-flex items-center gap-1">
            <input
              type="checkbox"
              checked={permisos.includes(r)}
              onChange={() => toggle(r)}
            />
            {r}
          </label>
        ))}
      </div>
      <div className="dashboard-card p-4">
        {puede("edicion", permisos) ? "Puede editar" : "Solo lectura"}
      </div>
    </div>
  );
}
