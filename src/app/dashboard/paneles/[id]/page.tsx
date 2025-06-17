"use client";

import { useEffect, useState, useRef } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import type { Usuario } from "@/types/usuario";
import useSession from "@/hooks/useSession";
import { useParams } from "next/navigation";
import { usePanelOps } from "../PanelOpsContext";

import dynamic from "next/dynamic";
import GridLayout, { Layout } from "react-grid-layout";

type LayoutItem = Layout & { z?: number };
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


interface HistEntry {
  fecha: string;
  estado: { widgets: string[]; layout: LayoutItem[] };
}

export default function PanelPage() {
  const { usuario, loading } = useSession();
  const params = useParams();
  const panelId = Array.isArray(params?.id) ? params.id[0] : (params as any)?.id;

  const [catalogo, setCatalogo] = useState<WidgetMeta[]>([]);
  const [widgets, setWidgets] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [componentes, setComponentes] = useState<{ [key: string]: any }>({});
  const [errores, setErrores] = useState<{ [key: string]: boolean }>({});
  const { setGuardar, setMostrarHistorial, setUndo, setRedo, readOnly, zoom } = usePanelOps();
  const [openHist, setOpenHist] = useState(false);
  const [historial, setHistorial] = useState<HistEntry[]>([]);
  const [undoHist, setUndoHist] = useState<{ widgets: string[]; layout: LayoutItem[] }[]>([])
  const [undoIdx, setUndoIdx] = useState(-1)
  const [readyHistory, setReadyHistory] = useState(false)
  const skipHistory = useRef(false)


  // 2. Cargar catálogo y componentes de widgets
  useEffect(() => {
    if (!usuario || !panelId) return;

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
              import(`../../components/widgets/${widget.file}`).catch(() => {
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
          z: i + 1,
        }));
        let saved: { widgets: string[]; layout: LayoutItem[] } | null = null;
        try {
          const resLayout = await apiFetch(`/api/paneles/${panelId}`);
          if (resLayout.ok) saved = (await jsonOrNull(resLayout)).panel;
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

          const lay = filteredLayout.length ? filteredLayout : defaultLayout
          const wid = filteredWidgets.length ? filteredWidgets : validKeys
          setLayout(lay)
          setWidgets(wid)
          setUndoHist([{ widgets: wid, layout: lay }])
          setUndoIdx(0)
          setReadyHistory(true)
        } else {
          const lay = defaultLayout
          const wid = permitidos.map((w: WidgetMeta) => w.key)
          setLayout(lay)
          setWidgets(wid)
          setUndoHist([{ widgets: wid, layout: lay }])
          setUndoIdx(0)
          setReadyHistory(true)
        }
      } catch (err) {
        console.error("Error al cargar widgets:", err);
      }
    }

    loadWidgets();
  }, [usuario, panelId]);

  const guardar = async () => {
    if (!usuario || !panelId) return;
    const data = { widgets, layout };
    await apiFetch(`/api/paneles/${panelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
  };

  // Guardar en DB y registrar historial local
  useEffect(() => {
    if (!readyHistory) return
    guardar()
    if (skipHistory.current) {
      skipHistory.current = false
      return
    }
    setUndoHist((h) => [...h.slice(0, undoIdx + 1), { widgets, layout }])
    setUndoIdx((i) => i + 1)
  }, [widgets, layout])

  useEffect(() => {
    setGuardar(() => guardar);
  }, [guardar, setGuardar]);

  useEffect(() => {
    setUndo(() => undo);
    setRedo(() => redo);
  }, [undo, redo, setUndo, setRedo]);

  useEffect(() => {
    setMostrarHistorial(() => () => setOpenHist(true));
  }, [setMostrarHistorial]);

  useEffect(() => {
    if (!openHist || !usuario || !panelId) return;
    apiFetch(`/api/paneles/${panelId}/historial`)
      .then(jsonOrNull)
      .then((d) => setHistorial(d.historial || []))
      .catch(() => {});
  }, [openHist, usuario, panelId]);

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
    const maxZ = layout.reduce((m, it) => Math.max(m, it.z || 0), 0);
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
        z: maxZ + 1,
      },
    ]);
  };

  const bringToFront = (id: string) => {
    setLayout((prev) => {
      const maxZ = prev.reduce((m, it) => Math.max(m, it.z || 0), 0);
      return prev.map((it) =>
        it.i === id ? { ...it, z: maxZ + 1 } : it,
      );
    });
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

  const restoreVersion = (entry: HistEntry) => {
    setWidgets(entry.estado.widgets);
    setLayout(entry.estado.layout);
  };

  const undo = () => {
    if (undoIdx <= 0) return
    const prev = undoHist[undoIdx - 1]
    if (!prev) return
    skipHistory.current = true
    setWidgets(prev.widgets)
    setLayout(prev.layout)
    setUndoIdx((i) => i - 1)
  }

  const redo = () => {
    if (undoIdx >= undoHist.length - 1) return
    const next = undoHist[undoIdx + 1]
    if (!next) return
    skipHistory.current = true
    setWidgets(next.widgets)
    setLayout(next.layout)
    setUndoIdx((i) => i + 1)
  }

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
    <div className="min-h-screen p-4 sm:p-8 overflow-auto" data-oid="japsa91">
      <div
        className="flex items-center justify-between mb-5"
        data-oid="zm1.jco"
      >
        <h1 className="text-2xl font-bold" data-oid="ulnh9zq">
          Panel
        </h1>
        <div className="flex items-center gap-2" data-oid="kuayohc">
          {!readOnly && (
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
          )}
        </div>
      </div>

      <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
      <GridLayout
        layout={layout}
        cols={12}
        rowHeight={95}
        width={1600}
        isResizable={!readOnly}
        isDraggable={!readOnly}
        preventCollision={false}
        compactType={null}
        allowOverlap
        autoSize={false}
        onLayoutChange={(l) =>
          setLayout((prev) =>
            l.map((it) => {
              const found = prev.find((p) => p.i === it.i);
              return { ...found, ...it } as LayoutItem;
            }),
          )
        }
        draggableHandle=".dashboard-widget-card"
        margin={[18, 18]}
        data-oid="hxrbk.e"
        style={{ minHeight: "100vh" }}
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
                {!readOnly && (
                  <button
                    className="ml-4 text-xs text-red-500 underline"
                    onClick={() => handleRemoveWidget(key)}
                    title="Quitar widget problemático"
                    data-oid="2.9u:_t"
                  >
                    Quitar
                  </button>
                )}
              </div>
            );
          }

          // Si todo bien, renderiza el widget
          const item = layout.find((l) => l.i === key);
          return (
            <div
              key={key}
              className="dashboard-widget-card"
              style={{ zIndex: item?.z || 1 }}
              onMouseDown={() => bringToFront(key)}
              data-oid="ldgxhem"
            >
              <Widget usuario={usuario} data-oid="c3illgc" />
              {!readOnly && (
                <button
                  onClick={() => handleRemoveWidget(key)}
                  title="Eliminar widget"
                  className="absolute top-2 right-2 text-lg text-gray-400 hover:text-red-600"
                  data-oid="9b3gzg4"
                >
                  ✕
                </button>
              )}
            </div>
          );
        })}
      </GridLayout>
      </div>
      {openHist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-[var(--dashboard-card)] p-4 rounded max-h-[80vh] overflow-auto w-80">
            <h2 className="font-semibold mb-2">Historial</h2>
            <ul className="space-y-2 text-sm">
              {historial.map((h, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span>{new Date(h.fecha).toLocaleString()}</span>
                  <button onClick={() => restoreVersion(h)} className="underline">Restaurar</button>
                </li>
              ))}
              {!historial.length && <li className="text-gray-400">Sin historial</li>}
            </ul>
            <button onClick={() => setOpenHist(false)} className="mt-3 px-3 py-1 bg-white/10 rounded w-full text-sm">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
