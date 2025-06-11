"use client";
import type { Material } from "./MaterialRow";

export default function ExportNavbar({ material }: { material: Material | null }) {
  if (!material?.dbId) return null;
  const base = `/api/materiales/${material.dbId}/export?format=`;
  const opciones = ["pdf", "excel", "image", "xml", "csv", "json", "yaml"];
  return (
    <nav className="flex flex-wrap gap-2 mb-2 text-xs">
      {opciones.map((o) => (
        <a
          key={o}
          href={base + o}
          className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
        >
          {o.toUpperCase()}
        </a>
      ))}
    </nav>
  );
}
