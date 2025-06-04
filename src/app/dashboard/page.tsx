"use client";

import { useEffect, useState } from "react";

import PizarraCanvas from "./components/pizarra/PizarraCanvas";
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

interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  plan?: { nombre?: string };
  [key: string]: any;
}

export default function DashboardPage() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loadingUsuario, setLoadingUsuario] = useState(true);
  const [errorUsuario, setErrorUsuario] = useState("");

  const [catalogo, setCatalogo] = useState<WidgetMeta[]>([]);
  const [widgets, setWidgets] = useState<string[]>([]);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [componentes, setComponentes] = useState<{ [key: string]: any }>({});
  const [errores, setErrores] = useState<{ [key: string]: boolean }>({});

  const [showPizarra, setShowPizarra] = useState(false);

  // 1. Obtener usuario logueado
  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success) throw new Error("Sesión no válida");
        setUsuario(data.usuario);
      })
      .catch(() => setErrorUsuario("Debes iniciar sesión"))
      .finally(() => setLoadingUsuario(false));
  }, []);

  // 2. Cargar catálogo y componentes de widgets
  useEffect(() => {
    if (!usuario) return;

    const plan = usuario.plan?.nombre || "Free";
    fetch("/api/widgets")
      .then((res) => res.json())
      .then((data) => {
        const permitidos = data.widgets.filter(
          (w: WidgetMeta) => !w.plans || w.plans.includes(plan)
        );
        setCatalogo(permitidos);

        const mapa: Record<string, any> = {};
        permitidos.forEach((widget: WidgetMeta) => {
          mapa[widget.key] = dynamic(
            () =>
              import(`./components/widgets/${widget.file}`)
                .catch(() => {
                  // Si falla la importación, marca error
                  setErrores(prev => ({ ...prev, [widget.key]: true }));
                  return {
                    default: () => null
                  };
                }),
            { ssr: false }
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
          const raw = localStorage.getItem(`dashboardLayout_${usuario.id}`);
          if (raw) saved = JSON.parse(raw);
        } catch {
          // si el JSON es inválido, ignoramos
        }

        if (saved && Array.isArray(saved.widgets) && Array.isArray(saved.layout)) {
          const validKeys = permitidos.map((w) => w.key);
          const filteredWidgets = saved.widgets.filter((k) => validKeys.includes(k));
          const filteredLayout = saved.layout.filter((item) => validKeys.includes(item.i));

          setLayout(filteredLayout.length ? filteredLayout : defaultLayout);
          setWidgets(filteredWidgets.length ? filteredWidgets : validKeys);
        } else {
          setLayout(defaultLayout);
          setWidgets(permitidos.map((w: WidgetMeta) => w.key));
        }
      })
      .catch((err) => console.error("Error al cargar widgets:", err));
  }, [usuario]);

  // Guardar en localStorage cada que cambian widgets o layout
  useEffect(() => {
    if (!usuario) return;
    const data = JSON.stringify({ widgets, layout });
    try {
      localStorage.setItem(`dashboardLayout_${usuario.id}`, data);
    } catch {}
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
    setErrores(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  };

  // Loading/errores de sesión
  if (loadingUsuario) return <div data-oid="lwpjukq">Cargando usuario...</div>;
  if (errorUsuario || !usuario)
    return (
      <div data-oid=".l_nz-z">
        {errorUsuario || "Sesión inválida"}{" "}
        <a href="/login" data-oid="_z2psz7">
          Iniciar sesión
        </a>
      </div>
    );

  return (
    <div className="min-h-screen p-4 sm:p-8" data-oid="7h725.b">
      <div className="flex items-center justify-between mb-5" data-oid="bjx2qyk">
        <h1 className="text-2xl font-bold" data-oid="4rx1xg2">
          Panel principal
        </h1>
        <div className="flex items-center gap-2">
          <select
            onChange={(e) => handleAddWidget(e.target.value)}
            value=""
            data-oid=".afd4c5"
          >
            <option disabled value="" data-oid="6wcsx7v">
              Agregar widget...
            </option>
            {catalogo
              .filter((w) => !widgets.includes(w.key))
              .map((w) => (
                <option key={w.key} value={w.key} data-oid="z4paaf7">
                  {w.title}
                </option>
              ))}
          </select>
          <button
            onClick={() => setShowPizarra(true)}
            className="dashboard-btn"
            data-oid="open-pizarra"
          >
            Abrir Pizarra
          </button>
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
            data-oid="6l8-9mp"
          >
            {widgets.map((key) => {
              const Widget = componentes[key];
              const widgetMeta = catalogo.find(w => w.key === key);

          // No renderiza hasta que esté listo el componente dinámico
          if (!Widget) {
            return (
              <div key={key} className="dashboard-widget-card flex items-center justify-center" style={{ minHeight: 90 }}>
                <span className="text-sm text-gray-500">
                  Cargando widget <b>{widgetMeta?.title || key}</b>...
                </span>
              </div>
            );
          }

          // Si hubo error cargando ese widget
          if (errores[key]) {
            return (
              <div key={key} className="dashboard-widget-card flex items-center justify-center bg-red-100 border border-red-300" style={{ minHeight: 90 }}>
                <span className="text-sm text-red-600">
                  Widget <b>{widgetMeta?.title || key}</b> no disponible.
                </span>
                <button
                  className="ml-4 text-xs text-red-500 underline"
                  onClick={() => handleRemoveWidget(key)}
                  title="Quitar widget problemático"
                >
                  Quitar
                </button>
              </div>
            );
          }

          // Si todo bien, renderiza el widget
          return (
            <div key={key} className="dashboard-widget-card" data-oid="z6wmao4">
              <Widget usuario={usuario} data-oid="4aelqx5" />
              <button
                onClick={() => handleRemoveWidget(key)}
                data-oid="ib037i_"
                title="Eliminar widget"
                className="absolute top-2 right-2 text-lg text-gray-400 hover:text-red-600"
              >
                ✕
              </button>
            </div>
          );
        })}

      </GridLayout>
      {showPizarra && (
        <PizarraCanvas onClose={() => setShowPizarra(false)} />
      )}
    </div>
  );
}
