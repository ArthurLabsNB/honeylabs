"use client";
import React from "react";

interface Props {
  info: any | null;
}

export default function ScanInfo({ info }: Props) {
  if (!info) return <p>No hay información.</p>;
  const obj = info[info.tipo] ?? {};
  const title =
    info.tipo === "almacen"
      ? "Almacén"
      : info.tipo === "material"
        ? "Material"
        : info.tipo === "unidad"
          ? "Unidad"
          : "";
  return (
    <div>
      <h2 className="font-semibold mb-2">{title}</h2>
      <pre className="text-xs whitespace-pre-wrap break-all border rounded p-2 bg-white/5">
        {JSON.stringify(obj, null, 2)}
      </pre>
    </div>
  );
}
