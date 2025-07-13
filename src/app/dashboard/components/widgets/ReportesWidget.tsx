"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";

interface Reporte {
  id: number;
  tipo: string;
  fecha: string;
  observaciones?: string | null;
}

export default function ReportesWidget() {
  const [items, setItems] = useState<Reporte[]>([]);

  useEffect(() => {
    apiFetch("/api/reportes")
      .then((r) => jsonOrNull(r))
      .then((d) => setItems(d?.reportes?.slice(0, 3) || []))
      .catch(() => {});
  }, []);

  return (
    <div className="p-4 space-y-2">
      <h3 className="font-semibold text-lg">Últimos reportes</h3>
      <ul className="text-sm space-y-1">
        {items.map((r) => (
          <li key={r.id} className="flex justify-between">
            <span>{r.tipo}</span>
            <span className="text-zinc-500">{new Date(r.fecha).toLocaleDateString()}</span>
          </li>
        ))}
        {items.length === 0 && <li className="text-zinc-500">Sin registros</li>}
      </ul>
    </div>
  );
}
