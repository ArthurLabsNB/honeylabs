"use client";

import { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import Spinner from "@/components/Spinner";
import dynamic from "next/dynamic";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

const Bar = dynamic(() => import("react-chartjs-2").then(m => m.Bar), { ssr: false });

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DashboardHome() {
  const { usuario, loading } = useSession();
  const [resumen, setResumen] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    apiFetch("/api/dashboard/resumen")
      .then(jsonOrNull)
      .then(setResumen)
      .catch(() => setResumen(null));
    apiFetch("/api/metrics")
      .then(jsonOrNull)
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  if (loading)
    return <div className="p-4" data-oid="home-loading"><Spinner /></div>;
  if (!usuario)
    return (
      <div className="p-4" data-oid="home-nosession">
        Sesión inválida <a href="/login">Iniciar sesión</a>
      </div>
    );

  return (
    <div className="p-4 space-y-6" data-oid="home-root">
      <h1 className="text-2xl font-bold">Panel principal</h1>
      {resumen ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-white/5">
            <span className="block text-sm text-[var(--dashboard-muted)]">Almacenes</span>
            <span className="text-2xl font-bold">{resumen.almacenes}</span>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <span className="block text-sm text-[var(--dashboard-muted)]">Materiales</span>
            <span className="text-2xl font-bold">{resumen.materiales}</span>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <span className="block text-sm text-[var(--dashboard-muted)]">Unidades</span>
            <span className="text-2xl font-bold">{resumen.unidades}</span>
          </div>
          <div className="p-4 rounded-lg bg-white/5">
            <span className="block text-sm text-[var(--dashboard-muted)]">Movimientos</span>
            <span className="text-2xl font-bold">{resumen.movimientos}</span>
          </div>
        </div>
      ) : (
        <div className="text-[var(--dashboard-muted)]" data-oid="home-reserr">No disponible</div>
      )}

      {metrics && Bar ? (
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
      ) : (
        <div className="text-[var(--dashboard-muted)]" data-oid="home-merr">Cargando gráficas...</div>
      )}
    </div>
  );
}
