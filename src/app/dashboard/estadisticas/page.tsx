"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";

const Bar = dynamic(() => import("react-chartjs-2").then(m => m.Bar), { ssr: false });

export default function EstadisticasPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [extra, setExtra] = useState<any>(null);

  useEffect(() => {
    apiFetch("/api/metrics").then(jsonOrNull).then(setMetrics).catch(() => {});
    apiFetch("/api/metrics/historial").then(jsonOrNull).then(setExtra).catch(() => {});
  }, []);

  return (
    <div className="space-y-6" data-oid="estadisticas-root">
      <h1 className="text-2xl font-bold">Estadísticas</h1>
      {metrics && Bar && (
        <Bar
          options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true } } }}
          data={{
            labels: ["Entradas", "Salidas", "Usuarios", "Almacenes"],
            datasets: [
              {
                label: "Total",
                data: [metrics.entradas, metrics.salidas, metrics.usuarios, metrics.almacenes],
                backgroundColor: "#fbbf24",
              },
            ],
          }}
        />
      )}
      {extra && (
        <ul className="text-sm space-y-1">
          <li>Tiempo promedio de edición: {extra.tiempoEdicionPromedio} min</li>
          <li>Usuarios activos: {extra.usuariosActivos}</li>
          <li>Cambios esta sesión: {extra.cambiosSesion}</li>
        </ul>
      )}
    </div>
  );
}
