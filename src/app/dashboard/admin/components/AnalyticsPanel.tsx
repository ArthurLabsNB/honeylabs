"use client";

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import type {
  ChartData,
  ChartOptions,
  DefaultDataPoint,
  BubbleDataPoint,
  ScatterDataPoint,
} from "chart.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  BubbleController,
  ScatterController,
  Filler,
  Legend,
  Tooltip,
} from "chart.js";

/********************  R E G I S T R O   G L O B A L  *******************/
// Evitamos el error "category is not a registered scale" y habilitamos
// todos los controladores/elementos que necesitaremos sin volver a registrar.
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  BubbleController,
  ScatterController,
  Filler,
  Legend,
  Tooltip
);

/********************  C A R G A   D I N Á M I C A  *********************/
// Un único wrapper genérico capaz de renderizar cualquier tipo de gráfica.
const Chart = dynamic(() => import("react-chartjs-2").then((m) => m.Chart), {
  ssr: false,
});

/***********************  T Y P E S   &   C O N S T *********************/
export type MetricsResponse = Record<string, number[]>; // 7 valores por métrica.

const WEEK_LABELS = ["L", "M", "M", "J", "V", "S", "D"] as const;

const CHART_TYPES = [
  { value: "line", label: "Líneas" },
  { value: "bar", label: "Barras" },
  { value: "radar", label: "Radar" },
  { value: "pie", label: "Pie" },
  { value: "doughnut", label: "Doughnut" },
  { value: "polarArea", label: "Polar Area" },
  { value: "scatter", label: "Scatter" },
  { value: "bubble", label: "Bubble" },
  { value: "area", label: "Área (relleno)" },
  { value: "stackedBar", label: "Barras apiladas" },
  { value: "horizontalBar", label: "Barras horizontales" },
] as const;

/***************************  C O M P O N E N T E  **********************/
export default function AnalyticsPanel() {
  const [metrics, setMetrics] = useState<MetricsResponse | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [chartType, setChartType] = useState<typeof CHART_TYPES[number]["value"]>(
    "line"
  );

  /* ------------------------------   F E T C H ------------------------------ */
  useEffect(() => {
    apiFetch("/api/metrics")
      .then(jsonOrNull)
      .then((d) => {
        setMetrics(d);
        setSelected(Object.keys(d ?? {}));
      })
      .catch((err) => setError(err?.message ?? "Error inesperado"));
  }, []);

  /* --------------------------------  H E L P -------------------------------- */
  const toggleMetric = (k: string) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  /* -------------------------  P A L E T T E   C O R E ------------------------ */
  const palette = [
    "#FBBF24", // amber-400
    "#60A5FA", // blue-400
    "#34D399", // green-400
    "#F87171", // red-400
    "#A78BFA", // violet-400
    "#F472B6", // pink-400
    "#38BDF8", // sky-400
    "#FDBA74", // orange-400
    "#4ADE80", // emerald-400
    "#C084FC", // purple-400
  ];

  /* -----------------------------  C H A R T   D A T A ------------------------ */
  const chartData = useMemo<ChartData<string, DefaultDataPoint<string>>>(() => {
    if (!metrics) return { labels: [], datasets: [] };

    // Pie / doughnut / polar - agrupan cada métrica en un solo valor sumado
    if (["pie", "doughnut", "polarArea"].includes(chartType)) {
      const labels = selected;
      const data = selected.map((k) => metrics[k]?.reduce((a, b) => a + b, 0) ?? 0);
      return {
        labels,
        datasets: [
          {
            data,
            backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          },
        ],
      };
    }

    // Bubble → generamos r proporcional al valor medio; Scatter similar.
    if (chartType === "bubble") {
      const datasets = selected.map((k, idx) => {
        const valores = metrics[k] ?? [];
        const media = valores.reduce((a, b) => a + b, 0) / valores.length;
        return {
          label: k,
          data: valores.map((v, i) => ({ x: i, y: v, r: Math.max(4, v / 2) } as BubbleDataPoint)),
          backgroundColor: palette[idx % palette.length],
        };
      });
      return { datasets } as unknown as ChartData<"bubble", BubbleDataPoint[]>;
    }

    if (chartType === "scatter") {
      const datasets = selected.map((k, idx) => ({
        label: k,
        data: (metrics[k] ?? []).map((v, i) => ({ x: i, y: v } as ScatterDataPoint)),
        backgroundColor: palette[idx % palette.length],
      }));
      return { datasets } as unknown as ChartData<"scatter", ScatterDataPoint[]>;
    }

    // Área se comporta como Line con fill: true
    const baseLineFill = chartType === "area";

    // Barras apiladas y horizontales comparten lógica de datos
    const labels = WEEK_LABELS;
    const datasets = selected.map((k, idx) => ({
      label: k,
      data: metrics[k] ?? [],
      backgroundColor: palette[idx % palette.length],
      borderColor: palette[idx % palette.length],
      fill: baseLineFill,
      tension: 0.3,
    }));

    return { labels, datasets };
  }, [metrics, selected, chartType]);

  /* ----------------------------  O P T I O N S ----------------------------- */
  const chartOptions = useMemo<ChartOptions>(() => {
    const common: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { mode: "index", intersect: false },
      },
      animation: {
        duration: 800,
        easing: "easeOutQuart",
      },
    };

    if (chartType === "stackedBar") {
      return {
        ...common,
        type: "bar",
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
      };
    }

    if (chartType === "horizontalBar") {
      return {
        ...common,
        type: "bar",
        indexAxis: "y" as const,
        scales: {
          y: { beginAtZero: true },
        },
      };
    }

    if (chartType === "line" || chartType === "area") {
      return {
        ...common,
        type: "line",
        scales: {
          y: { beginAtZero: true, ticks: { precision: 0 } },
        },
        // Pequena animación elástica en tensión de la línea
        animations: {
          tension: {
            duration: 1200,
            easing: "easeOutElastic",
            from: 0.5,
            to: 0,
            loop: false,
          },
        },
      };
    }

    // Para los demás tipos devolvemos options comunes
    return { ...common, type: chartType };
  }, [chartType]);

  /***************************  R E N D E R  *****************************/
  if (error) {
    return (
      <p className="rounded-md bg-red-500/10 p-4 text-sm text-red-300">
        {error}
      </p>
    );
  }

  if (!metrics) {
    return (
      <p className="animate-pulse text-sm text-muted-foreground">Cargando métricas…</p>
    );
  }

  const metricKeys = Object.keys(metrics);

  return (
    <section className="space-y-6">
      {/* ENCABEZADO */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Analíticas globales</h2>

        {/* Selector de tipo de gráfica */}
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as any)}
          className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1 text-sm focus:outline-none"
        >
          {CHART_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </header>

      {/* Filters de métricas */}
      <ul className="flex flex-wrap gap-3">
        {metricKeys.map((k) => (
          <li key={k} className="flex items-center gap-1 text-sm">
            <input
              id={`metric-${k}`}
              type="checkbox"
              checked={selected.includes(k)}
              onChange={() => toggleMetric(k)}
              className="accent-amber-400"
            />
            <label htmlFor={`metric-${k}`} className="cursor-pointer select-none">
              {k}
            </label>
          </li>
        ))}
      </ul>

      {/* Gráfica */}
      <div className="h-80 w-full">
        {selected.length > 0 && typeof window !== "undefined" ? (
          <Chart type={chartType as any} data={chartData as any} options={chartOptions} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Selecciona al menos una métrica para visualizar.
          </p>
        )}
      </div>
    </section>
  );
}