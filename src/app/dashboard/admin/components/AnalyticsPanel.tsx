"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";

const Line = dynamic(() => import("react-chartjs-2").then(m => m.Line), { ssr: false });

export default function AnalyticsPanel() {
  const [metrics, setMetrics] = useState<any>(null);
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    apiFetch("/api/metrics").then(jsonOrNull).then((d) => {
      setMetrics(d);
      setKeys(Object.keys(d || {}));
    }).catch(() => {});
  }, []);

  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (k: string) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  if (!metrics) return <p>Cargando...</p>;

  const datasets = selected.map((k) => ({
    label: k,
    data: Array.from({ length: 7 }, (_, i) => metrics[k] + i * 2),
    borderColor: "#fbbf24",
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Analíticas Globales</h2>
      <div className="flex flex-wrap gap-2">
        {keys.map((k) => (
          <label key={k} className="inline-flex items-center gap-1 text-sm">
            <input type="checkbox" checked={selected.includes(k)} onChange={() => toggle(k)} />
            {k}
          </label>
        ))}
      </div>
      {selected.length > 0 && Line && (
        <Line
          options={{ responsive: true, plugins: { legend: { display: false } } }}
          data={{
            labels: ["L", "M", "M", "J", "V", "S", "D"],
            datasets,
          }}
        />
      )}
    </div>
  );
}
