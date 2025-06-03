"use client";
import React from "react";
// Aquí puedes importar tu gráfica real (ej: Recharts/Chart.js)
export default function GraficaWidget({ usuario }: { usuario: any }) {
  return (
    <div
      className="h-32 flex items-center justify-center text-[var(--dashboard-muted)] opacity-70"
      data-oid="pi.zz-5"
    >
      [Aquí irá la gráfica de actividad]
    </div>
  );
}
