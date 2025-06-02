"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import GridLayout, { Layout } from "react-grid-layout";
import { useUser } from "./contexts/UserContext";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

type WidgetMeta = {
  key: string;
  title: string;
  file: string;
  category?: string;
  w?: number;
  h?: number;
  minW?: number;
  minH?: number;
  plans?: string[];
};

export default function DashboardPage() {
  const { usuario } = useUser();
  const plan = usuario?.plan?.nombre || "Free";

  const [catalogo, setCatalogo] = useState<WidgetMeta[]>([]);
  const [widgets, setWidgets] = useState<string[]>([]);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [componentes, setComponentes] = useState<{ [key: string]: any }>({});

  // === Obtener lista de widgets desde /api/widgets
  useEffect(() => {
    const loadWidgets = async () => {
      try {
        const res = await fetch("/api/widgets");
        const data = await res.json();
        const disponibles: WidgetMeta[] = data.widgets || [];

        // Filtrar por plan
        const permitidos = disponibles.filter(
          (w) => !w.plans || w.plans.includes(plan)
        );
        setCatalogo(permitidos);

        // Cargar dinámicamente componentes
        const mapa: Record<string, any> = {};
        for (const widget of permitidos) {
          const Comp = dynamic(() => import(`./components/widgets/${widget.file}`), {
            ssr: false,
          });
          mapa[widget.key] = Comp;
        }
        setComponentes(mapa);

        // Layout y widgets por defecto
        const defaultLayout = permitidos.map((w, i) => ({
          i: w.key,
          x: (i * 2) % 6,
          y: Math.floor(i / 3) * 2,
          w: w.w || 2,
          h: w.h || 2,
          minW: w.minW || 2,
          minH: w.minH || 2,
        }));

        setLayout(defaultLayout);
        setWidgets(permitidos.map((w) => w.key));
      } catch (err) {
        console.error("❌ Error al cargar widgets:", err);
      }
    };
    loadWidgets();
  }, [plan]);

  const handleAddWidget = (key: string) => {
    if (widgets.includes(key)) return;
    const widget = catalogo.find((w) => w.key === key);
    if (!widget) return;

    setWidgets((prev) => [...prev, key]);
    setLayout((prev) => [
      ...prev,
      {
        i: key,
        x: 0,
        y: Infinity,
        w: widget.w || 2,
        h: widget.h || 2,
        minW: widget.minW || 2,
        minH: widget.minH || 2,
      },
    ]);
  };

  const handleRemoveWidget = (key: string) => {
    setWidgets((prev) => prev.filter((k) => k !== key));
    setLayout((prev) => prev.filter((item) => item.i !== key));
  };

  const renderWidget = (key: string) => {
    const WidgetComponent = componentes[key];
    const meta = catalogo.find((w) => w.key === key);
    if (!WidgetComponent || !meta) return null;

    return (
      <div
        key={key}
        className="dashboard-widget-card animate-fade-in shadow-lg transition-all duration-200"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-lg">{meta.title}</span>
          <button
            onClick={() => handleRemoveWidget(key)}
            className="text-red-500 text-sm px-2 hover:bg-red-100/20 rounded absolute right-2 top-1"
            title="Eliminar widget"
          >
            ✕
          </button>
        </div>
        <div className="flex-1">
          <WidgetComponent usuario={usuario} />
        </div>
      </div>
    );
  };

  const disponibles = catalogo.filter((w) => !widgets.includes(w.key));

  return (
    <div className="dashboard-bg min-h-screen p-4 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold text-[var(--dashboard-accent)]">
          Panel principal
        </h1>
        <select
          className="dashboard-input"
          onChange={(e) => handleAddWidget(e.target.value)}
          value=""
        >
          <option value="" disabled>
            Agregar widget…
          </option>
          {disponibles.map((w) => (
            <option key={w.key} value={w.key}>
              {w.title}
            </option>
          ))}
        </select>
      </div>

      <GridLayout
        className="layout"
        layout={layout}
        cols={6}
        rowHeight={95}
        width={1100}
        isResizable
        isDraggable
        onLayoutChange={setLayout}
        draggableHandle=".dashboard-widget-card"
        margin={[18, 18]}
        containerPadding={[0, 0]}
      >
        {widgets.map(renderWidget)}
      </GridLayout>
    </div>
  );
}
