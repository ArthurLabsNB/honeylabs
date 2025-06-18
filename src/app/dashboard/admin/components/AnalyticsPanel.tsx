"use client";

/*****************************************************************************************
 * AnalyticsPanel.tsx  ─  Gráficas dinámicas con Chart.js + react-chartjs-2 + SWR        *
 * ------------------------------------------------------------------------------------------------
 * • 11 tipos de gráfica (líneas, áreas, barras, radar, scatter, bubble, pie, doughnut,   *
 *   polarArea, barras horizontales y apiladas)                                           *
 * • Datos actualizados en vivo desde /api/metrics con refresh automático cada minuto     *
 * • Registro explícito de todos los controllers / elements necesarios (Chart.js v4)      *
 * • Manejo robusto de métricas (array o número)                                          *
 * • Accesibilidad: selector de tipo + checkboxes por métrica + botones Quick‑select      *
 *****************************************************************************************/

import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
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
  // Scales
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  // Elements
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  // Controllers
  BarController,
  LineController,
  RadarController,
  PieController,
  DoughnutController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  // Plugins
  Legend,
  Tooltip,
  Filler,
  Chart as ChartJS,
} from "chart.js";

/* -------------------------------------------------------------------------- */
/*                           C H A R T . J S   S E T U P                      */
/* -------------------------------------------------------------------------- */
ChartJS.register(
  // Scales
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  // Elements
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  // Controllers
  BarController,
  LineController,
  RadarController,
  PieController,
  DoughnutController,
  PolarAreaController,
  BubbleController,
  ScatterController,
  // Plugins
  Legend,
  Tooltip,
  Filler
);

const Chart = dynamic(() => import("react-chartjs-2").then((m) => m.Chart), {
  ssr: false,
});

/* -------------------------------------------------------------------------- */
/*                         C O N S T A N T E S   &   T Y P E S                */
/* -------------------------------------------------------------------------- */
export type MetricsResponse = Record<string, number | number[]>; // 7 valores o único número

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

type ChartTypeValue = (typeof CHART_TYPES)[number]["value"];

/* -------------------------------------------------------------------------- */
/*                              F E T C H E R                                 */
/* -------------------------------------------------------------------------- */
const fetcher = (url: string) => apiFetch(url).then(jsonOrNull);

/* -------------------------------------------------------------------------- */
/*                           C O M P O N E N T E                               */
/* -------------------------------------------------------------------------- */
export default function AnalyticsPanel() {
  /* -------------------   D A T O S   D E S D E   A P I   ------------------ */
  const { data: metrics, error } = useSWR<MetricsResponse>(
    "/api/metrics",
    fetcher,
    { refreshInterval: 60_000, revalidateOnFocus: true }
  );

  /* ------------------   S E L E C C I Ó N   D E   M É T R I C A S   -------- */
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    if (metrics) setSelected(Object.keys(metrics));
  }, [metrics]);

  const [chartType, setChartType] = useState<ChartTypeValue>("line");

  const toggleMetric = (k: string) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  /* --------------------------------  P A L E T A  ------------------------- */
  const palette = [
    "#FBBF24",
    "#60A5FA",
    "#34D399",
    "#F87171",
    "#A78BFA",
    "#F472B6",
    "#38BDF8",
    "#FDBA74",
    "#4ADE80",
    "#C084FC",
  ];

  /* -------------------  H E L P E R :  v a l o r e s  ---------------------- */
  const valuesOf = (k: string): number[] => {
    const v = metrics?.[k];
    if (Array.isArray(v)) return v;
    if (typeof v === "number") return Array(WEEK_LABELS.length).fill(v);
    return Array(WEEK_LABELS.length).fill(0);
  };

  /* ------------------------------   D A T A   ------------------------------ */
  const data = useMemo<ChartData>(() => {
    if (!metrics) return { labels: [], datasets: [] };

    // Agrupaciones que requieren un solo dataset con sumatoria ----------------
    if (["pie", "doughnut", "polarArea"].includes(chartType)) {
      const labels = selected;
      return {
        labels,
        datasets: [
          {
            data: labels.map((k) => valuesOf(k).reduce((a, b) => a + b, 0)),
            backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          },
        ],
      };
    }

    // Bubble -----------------------------------------------------------------
    if (chartType === "bubble") {
      return {
        labels: WEEK_LABELS,
        datasets: selected.map((k, idx) => ({
          label: k,
          data: valuesOf(k).map(
            (v, i) => ({ x: i, y: v, r: Math.max(4, v / 2) }) as BubbleDataPoint
          ),
          backgroundColor: palette[idx % palette.length],
        })),
      } as ChartData<"bubble", BubbleDataPoint[]>;
    }

    // Scatter ----------------------------------------------------------------
    if (chartType === "scatter") {
      return {
        labels: WEEK_LABELS,
        datasets: selected.map((k, idx) => ({
          label: k,
          data: valuesOf(k).map((v, i) => ({ x: i, y: v }) as ScatterDataPoint),
          backgroundColor: palette[idx % palette.length],
        })),
      } as ChartData<"scatter", ScatterDataPoint[]>;
    }

    // Line / Bar / Radar / Área / Stacked / Horizontal -----------------------
    const fill = chartType === "area";
    return {
      labels: WEEK_LABELS,
      datasets: selected.map((k, idx) => ({
        label: k,
        data: valuesOf(k),
        backgroundColor: palette[idx % palette.length],
        borderColor: palette[idx % palette.length],
        fill,
        tension: 0.3,
      })),
    };
  }, [metrics, selected, chartType]);

  /* -----------------------------   O P T I O N S   ------------------------ */
  const options = useMemo<ChartOptions>(() => {
    const base: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: "bottom" },
        tooltip: { mode: "index", intersect: false },
      },
      animation: { duration: 800, easing: "easeOutQuart" },
    };

    if (chartType === "stackedBar")
      return {
        ...base,
        type: "bar",
        scales: {
          x: { stacked: true },
          y: { stacked: true, beginAtZero: true },
        },
      };

    if (chartType === "horizontalBar")
      return {
        ...base,
        type: "bar",
        indexAxis: "y" as const,
        scales: { y: { beginAtZero: true } },
      };

    if (chartType === "line" || chartType === "area")
      return {
        ...base,
        type: "line",
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
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

    return { ...base, type: chartType };
  }, [chartType]);

  /* -------------   M A P E O   D E   T I P O   →   C O N T R O L L E R  ---- */
  const controllerType: string =
    chartType === "area"
      ? "line"
      : chartType === "stackedBar" || chartType === "horizontalBar"
      ? "bar"
      : chartType;

  /* -----------------------------   R E N D E R   -------------------------- */
  if (error)
    return (
      <p className="rounded-md bg-red-500/10 p-4 text-sm text-red-300">
        {error}
      </p>
    );

  if (!metrics)
    return <p className="animate-pulse text-sm text-muted-foreground">Cargando métricas…</p>;

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Analíticas globales</h2>

        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value as ChartTypeValue)}
          className="rounded-lg border border-zinc-600 bg-zinc-800 px-3 py-1 text-sm focus:outline-none"
        >
          {CHART_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </header>

      {/* Quick actions */}
      <div className="flex gap-2 text-xs">
        <button
          onClick={() => setSelected(Object.keys(metrics!))}
          className="rounded border border-zinc-600 px-2 py-0.5 hover:bg-zinc-800"
        >
          Seleccionar todo
        </button>
        <button
          onClick={() => setSelected([])}
          className="rounded border border-zinc-600 px-2 py-0.5 hover:bg-zinc-800"
        >
          Limpiar
        </button>
      </div>

      {/* Metric filters */}
      <ul className="flex flex-wrap gap-3">
        {Object.keys(metrics!).map((k) => (
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

      {/* Chart */}
      <div className="h-80 w-full">
        {selected.length > 0 && typeof window !== "undefined" ? (
          <Chart key={chartType} type={controllerType as any} data={data as any} options={options} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Selecciona al menos una métrica para visualizar.
          </p>
        )}
      </div>
    </section>
  );
}
