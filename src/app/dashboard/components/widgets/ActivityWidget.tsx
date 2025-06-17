"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import Spinner from "@/components/Spinner";

export default function ActivityWidget({ panelId }: { panelId: string }) {
  const [items, setItems] = useState<{ fecha: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!panelId) return;
    setLoading(true);
    apiFetch(`/api/paneles/${panelId}/historial`)
      .then(jsonOrNull)
      .then((d) =>
        setItems(
          Array.isArray(d.historial)
            ? d.historial.slice(-5).reverse()
            : []
        )
      )
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [panelId]);

  if (loading) return <div className="py-2"><Spinner /></div>;
  if (err) return <div className="py-2 text-red-400">Error: {err}</div>;
  if (!items.length)
    return (
      <div className="py-2 text-[var(--dashboard-muted)]">Sin actividad</div>
    );

  return (
    <ul className="list-disc pl-5 text-sm space-y-1">
      {items.map((a, i) => (
        <li key={i}>{new Date(a.fecha).toLocaleString()}</li>
      ))}
    </ul>
  );
}
