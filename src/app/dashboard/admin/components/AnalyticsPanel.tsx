"use client";

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

/**********************************************************************
 * R E G I S T R O   G L O B A L                                      *
 *********************************************************************/
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

/**********************************************************************
 * C A R G A   D I N Á M I C A                                        *
 *********************************************************************/
const Chart = dynamic(() => import("react-chartjs-2").then((m) => m.Chart), {
  ssr: false,
});

/**********************************************************************
 * T Y P O S  &  C O N S T A N T E S                                  *
 *********************************************************************/
export type MetricsResponse = Record<string, number | number[]>;

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

/**********************************************************************
 * F E T C H E R                                                      *
 *********************************************************************/
const fetcher = (url: string) => apiFetch(url).then(jsonOrNull);

/**********************************************************************
 * C O M P O N E N T E                                                *
 *********************************************************************/
export default function AnalyticsPanel() {
  /* ------------------------------------------------------------------ */
  /*                         D A T A   F R O M   A P I                  */
  /* ------------------------------------------------------------------ */
  const { data: metrics, error } = useSWR<MetricsResponse>(
    "/api/metrics",
    fetcher,
    {
      refreshInterval: 60_000, // auto‑refresh cada minuto
      revalidateOnFocus: true,
    }
  );

  /* --------------------- S E L E C C I Ó N   D E   K E Y S ------------------ */
  const [selected, setSelected] = useState<string[]>([]);
  useEffect(() => {
    if (metrics) setSelected(Object.keys(metrics));
  }, [metrics]);

  const [chartType, setChartType] = useState<(typeof CHART_TYPES)[number]["value"]>(
    "line"
  );

  /* -------------------------  T O G G L E   M E T R I C -------------------- */
  const toggleMetric = (k: string) =>
    setSelected((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]));

  /* ------------------------------  P A L E T T E --------------------------- */
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

  /** Convierte cualquier métrica a array de 7 números */
  const toArray = (k: string): number[] => {
    const v = metrics?.[k];
    if (Array.isArray(v)) return v;
    if (typeof v === "number") return Array(WEEK_LABELS.length).fill(v);
    return Array(WEEK_LABELS.length).fill(0);
  };

  /* -----------------------------  C H A R T   D A T A ---------------------- */
  const chartData = useMemo<ChartData>(() => {
    if (!metrics) return { labels: [], datasets: [] };

    // Labels por defecto (necesarias para leyenda)
    const defaultLabels = WEEK_LABELS as unknown as string[];

    /* --- Pie / Doughnut / PolarArea ------------------------------------- */
    if (["pie", "doughnut", "polarArea"].includes(chartType)) {
      const labels = selected;
      const data = labels.map((k) => toArray(k).reduce((a, b) => a + b, 0));
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

    /* --- Bubble --------------------------------------------------------- */
    if (chartType === "bubble") {
      return {
        labels: defaultLabels,
        datasets: selected.map((k, idx) => ({
          label: k,
          data: toArray(k).map(
            (v, i) => ({ x: i, y: v, r: Math.max(4, v / 2) }) as BubbleDataPoint
          ),
          backgroundColor: palette[idx % palette.length],
        })),
      } as ChartData<"bubble", BubbleDataPoint[]>;
    }

    /* --- Scatter -------------------------------------------------------- */
    if (chartType === "scatter") {
      return {
        labels: defaultLabels,
        datasets: selected.map((k, idx) => ({
          label: k,
          data: toArray(k).map(
            (v, i) => ({ x: i, y: v }) as ScatterDataPoint
          ),
          backgroundColor: palette[idx % palette.length],
        })),
      } as ChartData<"scatter", ScatterDataPoint[]>;
    }

    /* --- Line / Bar / Area / Stacked / Horizontal ----------------------- */
    const fill = chartType === "area";
    return {
      labels: WEEK_LABELS,
      datasets: selected.map((k, idx) => ({
        label: k,
        data: toArray(k),
        backgroundColor: palette[idx % palette.length],
        borderColor: palette[idx % palette.length],
        fill,
        tension: 0.3,
      })),
    };
  }, [metrics, selected, chartType]);

  /* -----------------------------  C H A R T   O P T S ---------------------- */
  const chartOptions = useMemo<ChartOptions>(() => {
    const common: ChartOptions = {
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
        ...common,
        type: "bar",
        scales: { x: { stacked: true }, y: { stacked: true, beginAtZero: true } },
      };

    if (chartType === "horizontalBar")
      return {
        ...common,
        type: "bar",
        indexAxis: "y" as const,
        scales: { y: { beginAtZero: true } },
      };

    if (chartType === "line" || chartType === "area")
      return {
        ...common,
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

    return { ...common, type: chartType };
  }, [chartType]);

  /**********************************************************************
   * R E N D E R                                                        *
   *********************************************************************/
  if (error)
    return <p className="rounded-md bg-red-500/10 p-4 text-sm text-red-300">{error}</p>;

  if (!metrics)
    return (
      <p className="animate-pulse text-sm text-muted-foreground">Cargando métricas…</p>
    );

  const metricKeys = Object.keys(metrics);

  return (
    <section className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Analíticas globales</h2>

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

      {/* Metric toggles */}
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

      {/* Chart */}
      <div className="h-80 w-full">
        {selected.length > 0 && typeof window !== "undefined" ? (
          <Chart
            key={chartType}
            type={chartType as any}
            data={chartData as any}
            options={chartOptions}
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            Selecciona al menos una métrica para visualizar.
          </p>
        )}
      </div>
    </section>
  );
}
