"use client";

import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import type { Usuario } from "@/types/usuario";
import useSession from "@/hooks/useSession";

import dynamic from "next/dynamic";
import GridLayout, { Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

// Tipos
interface WidgetMeta {
  key: string;
  title: string;
  file: string;
  category?: string;
  w?: number;
  h?: number;
  minW?: number;
  minH?: number;
  plans?: string[];
}


export default function DashboardPage() {
  const { usuario, loading } = useSession();

  const [catalogo, setCatalogo] = useState<WidgetMeta[]>([]);
  const [widgets, setWidgets] = useState<string[]>([]);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [componentes, setComponentes] = useState<{ [key: string]: any }>({});
  const [errores, setErrores] = useState<{ [key: string]: boolean }>({});


  // 2. Cargar catálogo y componentes de widgets
  useEffect(() => {
    if (!usuario) return;

    async function loadWidgets() {
      try {
        const plan = usuario.plan?.nombre || "Free";
        const res = await apiFetch("/api/widgets");
        const data = await jsonOrNull(res);

        const permitidos = data.widgets.filter(
          (w: WidgetMeta) => !w.plans || w.plans.includes(plan),
        );
        setCatalogo(permitidos);

        const mapa: Record<string, any> = {};
        permitidos.forEach((widget: WidgetMeta) => {
          mapa[widget.key] = dynamic(
            () =>
              import(`./components/widgets/${widget.file}`).catch(() => {
                // Si falla la importación, marca error
                setErrores((prev) => ({ ...prev, [widget.key]: true }));
                return {
                  default: () => null,
                };
              }),
            { ssr: false },
          );
        });
        setComponentes(mapa);

        const defaultLayout = permitidos.map((w: WidgetMeta, i: number) => ({
          i: w.key,
          x: (i * 2) % 6,
          y: Math.floor(i / 3) * 2,
          w: w.w || 2,
          h: w.h || 2,
          minW: w.minW || 2,
          minH: w.minH || 2,
        }));

        let saved: { widgets: string[]; layout: Layout[] } | null = null;
        try {
          const resLayout = await apiFetch("/api/dashboard/layout");
          if (resLayout.ok) saved = await jsonOrNull(resLayout);
        } catch {}

        if (
          saved &&
          Array.isArray(saved.widgets) &&
          Array.isArray(saved.layout)
        ) {
          const validKeys = permitidos.map((w) => w.key);
          const filteredWidgets = saved.widgets.filter((k) =>
            validKeys.includes(k),
          );
          const filteredLayout = saved.layout.filter((item) =>
            validKeys.includes(item.i),
          );

          setLayout(filteredLayout.length ? filteredLayout : defaultLayout);
          setWidgets(filteredWidgets.length ? filteredWidgets : validKeys);
        } else {
          setLayout(defaultLayout);
          setWidgets(permitidos.map((w: WidgetMeta) => w.key));
        }
      } catch (err) {
        console.error("Error al cargar widgets:", err);
      }
    }

    loadWidgets();
  }, [usuario]);

  // Guardar en DB cada que cambian widgets o layout
  useEffect(() => {
    if (!usuario) return;
    const data = { widgets, layout };
    apiFetch("/api/dashboard/layout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
  }, [widgets, layout, usuario]);

  // Agregar widget
  const handleAddWidget = (key: string) => {
    if (widgets.includes(key)) return;
    const widget = catalogo.find((w) => w.key === key);
    if (!widget) return;

    const nextY = layout.reduce(
      (max, item) => Math.max(max, item.y + (item.h || 0)),
      0,
    );

    setWidgets([...widgets, key]);
    setLayout([
      ...layout,
      {
        i: key,
        x: 0,
        y: nextY,
        w: widget.w || 2,
        h: widget.h || 2,
        minW: widget.minW || 2,
        minH: widget.minH || 2,
      },
    ]);
  };

  // Quitar widget
  const handleRemoveWidget = (key: string) => {
    setWidgets(widgets.filter((k) => k !== key));
    setLayout(layout.filter((item) => item.i !== key));
    setErrores((prev) => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  // Loading/errores de sesión
  if (loading) return <div data-oid="_0v3rjj">Cargando usuario...</div>;
  if (!usuario)
    return (
      <div data-oid="k1:t11_">
        Sesión inválida{' '}
        <a href="/login" data-oid="si54zbn">
          Iniciar sesión
        </a>
      </div>
    );

  return (
    <div className="min-h-screen p-4 sm:p-8" data-oid="japsa91">
      <div
        className="flex items-center justify-between mb-5"
        data-oid="zm1.jco"
      >
        <h1 className="text-2xl font-bold" data-oid="ulnh9zq">
          Panel principal
        </h1>
        <div className="flex items-center gap-2" data-oid="kuayohc">
          <select
            onChange={(e) => handleAddWidget(e.target.value)}
            value=""
            data-oid="1cmvbl6"
          >
            <option disabled value="" data-oid="mdilp3j">
              Agregar widget...
            </option>
            {catalogo
              .filter((w) => !widgets.includes(w.key))
              .map((w) => (
                <option key={w.key} value={w.key} data-oid="i6tnk:1">
                  {w.title}
                </option>
              ))}
          </select>
        </div>
      </div>

      <GridLayout
        layout={layout}
        cols={6}
        rowHeight={95}
        width={1100}
        isResizable
        isDraggable
        onLayoutChange={setLayout}
        draggableHandle=".dashboard-widget-card"
        margin={[18, 18]}
        data-oid="hxrbk.e"
      >
        {widgets.map((key) => {
          const Widget = componentes[key];
          const widgetMeta = catalogo.find((w) => w.key === key);

          // No renderiza hasta que esté listo el componente dinámico
          if (!Widget) {
            return (
              <div
                key={key}
                className="dashboard-widget-card flex items-center justify-center"
                style={{ minHeight: 90 }}
                data-oid="yt4xd_q"
              >
                <span className="text-sm text-gray-500" data-oid="puzy-ax">
                  Cargando widget{" "}
                  <b data-oid="w85xvu2">{widgetMeta?.title || key}</b>...
                </span>
              </div>
            );
          }

          // Si hubo error cargando ese widget
          if (errores[key]) {
            return (
              <div
                key={key}
                className="dashboard-widget-card flex items-center justify-center bg-red-100 border border-red-300"
                style={{ minHeight: 90 }}
                data-oid="0-85dzh"
              >
                <span className="text-sm text-red-600" data-oid="wqbhms5">
                  Widget <b data-oid="9spv7ji">{widgetMeta?.title || key}</b> no
                  disponible.
                </span>
                <button
                  className="ml-4 text-xs text-red-500 underline"
                  onClick={() => handleRemoveWidget(key)}
                  title="Quitar widget problemático"
                  data-oid="2.9u:_t"
                >
                  Quitar
                </button>
              </div>
            );
          }

          // Si todo bien, renderiza el widget
          return (
            <div key={key} className="dashboard-widget-card" data-oid="ldgxhem">
              <Widget usuario={usuario} data-oid="c3illgc" />
              <button
                onClick={() => handleRemoveWidget(key)}
                title="Eliminar widget"
                className="absolute top-2 right-2 text-lg text-gray-400 hover:text-red-600"
                data-oid="9b3gzg4"
              >
                ✕
              </button>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}
