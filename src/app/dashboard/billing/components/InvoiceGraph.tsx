"use client";
import { Chart } from "react-chartjs-2";
import type { ChartData } from "chart.js";
interface Props { data: { fecha: string; total: number }[] }
export default function InvoiceGraph({ data }: Props) {
  const chart: ChartData<'line'> = {
    labels: data.map((d) => d.fecha),
    datasets: [
      { label: 'Total', data: data.map((d) => d.total), borderColor: '#f59e0b' },
    ],
  };
  return <Chart type="line" data={chart} />;
}
