"use client";
import React, { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function GraficaWidget({ usuario }: { usuario: any }) {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch("/api/metrics")
      .then(jsonOrNull)
      .then(setMetrics)
      .catch(() => setMetrics(null));
  }, []);

  if (!metrics)
    return (
      <div
        className="h-32 flex items-center justify-center text-[var(--dashboard-muted)] opacity-70"
        data-oid="p1v3u-8"
      >
        Cargando...
      </div>
    );

  const chartData = {
    labels: ["Entradas", "Salidas", "Usuarios", "Almacenes"],
    datasets: [
      {
        label: "Total",
        data: [
          metrics.entradas,
          metrics.salidas,
          metrics.usuarios,
          metrics.almacenes,
        ],

        backgroundColor: "#fbbf24",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  } as const;

  return <Bar options={options} data={chartData} data-oid="3eq7ggb" />;
}
