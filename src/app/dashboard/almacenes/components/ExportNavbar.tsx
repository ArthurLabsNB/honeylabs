"use client";
import type { Material } from "./MaterialRow";
import { buildMaterialPdf, buildMaterialExcel } from "@/lib/exportUtils";

export default function ExportNavbar({ material }: { material: Material | null }) {
  if (!material?.dbId) return null;
  const base = `/api/materiales/${material.dbId}/export?format=`;
  const opciones = ["pdf", "excel", "image", "xml", "csv", "json", "yaml"];
  const generarPdfJs = () => {
    const blob = buildMaterialPdf(material);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `material_${material.dbId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const generarExcelJs = () => {
    const blob = buildMaterialExcel(material);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `material_${material.dbId}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };
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
      <button
        type="button"
        onClick={generarPdfJs}
        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
      >
        PDF-JS
      </button>
      <button
        type="button"
        onClick={generarExcelJs}
        className="px-2 py-1 rounded bg-white/10 hover:bg-white/20"
      >
        EXCEL-JS
      </button>
    </nav>
  );
}
