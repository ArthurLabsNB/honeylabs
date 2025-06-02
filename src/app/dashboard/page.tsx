'use client';

import { useEffect, useState } from "react";
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
  const [errorUsuario, setErrorUsuario] = useState('');

  const [catalogo, setCatalogo] = useState<WidgetMeta[]>([]);
  const [widgets, setWidgets] = useState<string[]>([]);
  const [layout, setLayout] = useState<Layout[]>([]);
  const [componentes, setComponentes] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    fetch('/api/login', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (!data?.success) throw new Error('Sesión no válida');
        setUsuario(data.usuario);
      })
      .catch(() => setErrorUsuario('Debes iniciar sesión'))
      .finally(() => setLoadingUsuario(false));
  }, []);

  useEffect(() => {
    if (!usuario) return;

    const plan = usuario.plan?.nombre || "Free";

    fetch("/api/widgets")
      .then(res => res.json())
      .then(data => {
        const permitidos = data.widgets.filter((w: WidgetMeta) => !w.plans || w.plans.includes(plan));
        setCatalogo(permitidos);

        const mapa: Record<string, any> = {};
        permitidos.forEach(widget => {
          mapa[widget.key] = dynamic(() => import(`./components/widgets/${widget.file}`), { ssr: false });
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

        setLayout(defaultLayout);
        setWidgets(permitidos.map((w: WidgetMeta) => w.key));
      })
      .catch(err => console.error("Error al cargar widgets:", err));

  }, [usuario]);

  if (loadingUsuario) return <div>Cargando usuario...</div>;
  if (errorUsuario || !usuario) return <div>{errorUsuario || "Sesión inválida"} <a href="/login">Iniciar sesión</a></div>;

  const handleAddWidget = (key: string) => {
    if (widgets.includes(key)) return;
    const widget = catalogo.find(w => w.key === key);
    if (!widget) return;

    setWidgets([...widgets, key]);
    setLayout([...layout, {
      i: key,
      x: 0,
      y: Infinity,
      w: widget.w || 2,
      h: widget.h || 2,
      minW: widget.minW || 2,
      minH: widget.minH || 2,
    }]);
  };

  const handleRemoveWidget = (key: string) => {
    setWidgets(widgets.filter(k => k !== key));
    setLayout(layout.filter(item => item.i !== key));
  };

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">Panel principal</h1>
        <select onChange={e => handleAddWidget(e.target.value)} value="">
          <option disabled value="">Agregar widget...</option>
          {catalogo.filter(w => !widgets.includes(w.key)).map(w => (
            <option key={w.key} value={w.key}>{w.title}</option>
          ))}
        </select>
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
      >
        {widgets.map(key => {
          const Widget = componentes[key];
          return (
            <div key={key} className="dashboard-widget-card">
              <Widget usuario={usuario} />
              <button onClick={() => handleRemoveWidget(key)}>✕</button>
            </div>
          );
        })}
      </GridLayout>
    </div>
  );
}