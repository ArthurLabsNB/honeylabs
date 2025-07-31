"use client";
import { ArrowLeft, Download, Share2, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { FOCUS_SEARCH_EVENT } from "@/lib/ui-events";
import { useParams, useRouter } from "next/navigation";
import useSession from "@/hooks/useSession";
import { apiFetch } from "@lib/api";
import html2canvas from 'html2canvas';
import { jsonOrNull } from "@lib/http";
import { usePanelOps } from "../PanelOpsContext";
import usePanelPresence from "@/hooks/usePanelPresence";
import { buildEventoICS } from '@/lib/calendar';
import { useToast } from "@/components/Toast";
import { useDashboardUI } from "../../ui";

export default function PanelDetailNavbar({ onShowHistory }: { onShowHistory?: () => void }) {
  const { usuario } = useSession();
  const plan = usuario?.plan?.nombre || "Free";
  const params = useParams();
  const panelId = Array.isArray(params?.id) ? params.id[0] : (params as any)?.id;
  const [nombre, setNombre] = useState("");
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const toast = useToast();
  const searchRef = useRef<HTMLInputElement>(null);
  const [openExport, setOpenExport] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [openConfig, setOpenConfig] = useState(false);
  const [shortcuts, setShortcuts] = useState(() => {
    if (typeof window === 'undefined') return { undo: 'ctrl+z', redo: 'ctrl+shift+z' };
    try {
      const saved = JSON.parse(localStorage.getItem('panel-shortcuts') || '{}');
      return { undo: 'ctrl+z', redo: 'ctrl+shift+z', ...saved };
    } catch {
      return { undo: 'ctrl+z', redo: 'ctrl+shift+z' };
    }
  });
  const [openHelp, setOpenHelp] = useState(false);
  const [openWiki, setOpenWiki] = useState(false);
  const [openTools, setOpenTools] = useState(false);
  const conectados = usePanelPresence(panelId, usuario);
  const { toggleFullscreen } = useDashboardUI();
  const {
    guardar,
    undo,
    redo,
    readOnly,
    toggleReadOnly,
    zoom,
    setZoom,
    mostrarCambios,
    mostrarComentarios,
    buscar,
    setBuscar,
    unsaved,
    setUnsaved,
    showGrid,
    toggleGrid,
    gridSize,
    setGridSize,
  } = usePanelOps();
  const router = useRouter();

  const guardarNombre = async () => {
    if (!panelId) return;
    setSaving("saving");
    await apiFetch(`/api/paneles/${panelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    setSaving("saved");
    setTimeout(() => setSaving("idle"), 2000);
  };


  useEffect(() => {
    const close = () => {
      setOpenExport(false);
      setOpenShare(false);
      setOpenConfig(false);
      setOpenHelp(false);
      setOpenWiki(false);
      setOpenTools(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    const focus = () => searchRef.current?.focus();
    document.addEventListener(FOCUS_SEARCH_EVENT, focus);
    return () => document.removeEventListener(FOCUS_SEARCH_EVENT, focus);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return
    const color = localStorage.getItem('panel-accent')
    if (color) {
      document.documentElement.style.setProperty('--dashboard-accent', color)
      document.documentElement.style.setProperty('--dashboard-accent-hover', color)
    }
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenExport(false)
        setOpenShare(false)
        setOpenConfig(false)
        setOpenHelp(false)
        setOpenWiki(false)
        setOpenTools(false)
      } else if (e.key === '/' && document.activeElement !== searchRef.current) {
        e.preventDefault()
        searchRef.current?.focus()
      } else if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
      } else if ((e.key === '+' || e.key === '=') && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setZoom(z => Math.min(2, z + 0.1))
      } else if (e.key === '-' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setZoom(z => Math.max(0.5, z - 0.1))
      } else if (e.key === 's' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        guardar();
        guardarNombre();
        setUnsaved(false);
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [toggleFullscreen, setZoom, guardar, guardarNombre, setUnsaved])

  useEffect(() => {
    if (!panelId) return;
    apiFetch(`/api/paneles/${panelId}`)
      .then(jsonOrNull)
      .then((d) => setNombre(d.panel?.nombre || "Sin título"))
      .catch(() => {});
  }, [panelId]);


  const exportar = async (formato: string) => {
    if (!panelId) return;
    if (formato === "json") {
      const res = await apiFetch(`/api/paneles/${panelId}`);
      const data = await jsonOrNull(res);
      if (!data?.panel) return;
      const blob = new Blob([
        JSON.stringify(data.panel, null, 2),
      ], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pizarra_${panelId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (formato === 'png') {
      const area = document.getElementById('panel-area');
      if (!area) return;
      const canvas = await html2canvas(area);
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `pizarra_${panelId}.png`;
      a.click();
    } else if (formato === 'ics') {
      const start = new Date();
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const ics = buildEventoICS(nombre || `Pizarra ${panelId}`, start, end);
      const blob = new Blob([ics], { type: 'text/calendar' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pizarra_${panelId}.ics`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      toast.show(`Exportar ${formato} no implementado`, 'error');
    }
  };

  const copyLink = useCallback(() => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(
      () => toast.show('Enlace copiado', 'success'),
      () => toast.show('No se pudo copiar', 'error')
    );
  }, []);

  const salir = useCallback(async () => {
    await guardar()
    await guardarNombre()
    setUnsaved(false)
    router.push('/dashboard/paneles')
  }, [guardar, guardarNombre, router, setUnsaved])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-[var(--dashboard-navbar)] border-b border-[var(--dashboard-border)] shadow"
      style={{ minHeight: "70px", width: "100%" }}
    >
      <div className="flex items-center justify-between h-[70px] px-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/paneles" className="p-2 text-gray-400 hover:bg-white/10 rounded-lg" title="Volver">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Image src="/logo-honeylabs.png" alt="HoneyLabs" width={20} height={20} />
          {edit ? (
            <input
              className="bg-transparent border-b outline-none text-sm"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onBlur={() => {
                setEdit(false);
                guardarNombre();
              }}
              autoFocus
            />
          ) : (
            <span className="font-semibold text-sm cursor-text" onClick={() => setEdit(true)}>
              {nombre} {unsaved ? '*' : ''}
            </span>
          )}
          <span className="absolute left-0 -bottom-4 text-xs text-gray-400">{plan}</span>
          <div className="flex -space-x-2 ml-2">
            {conectados.map((u) => (
              u.avatar ? (
                <img
                  key={u.id}
                  src={u.avatar}
                  alt={u.nombre || ''}
                  className="w-6 h-6 rounded-full border-2 border-white"
                  title={u.nombre}
                />
              ) : (
                <div
                  key={u.id}
                  className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs border-2 border-white"
                  title={u.nombre}
                >
                  {u.nombre?.[0] || '?'}
                </div>
              )
            ))}
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            ref={searchRef}
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
            className="ml-3 text-sm px-2 py-1 rounded bg-white/10 focus:bg-white/20 outline-none"
          />
        </div>
      </div>
      <nav className="flex flex-wrap items-center gap-4 px-4 py-2 border-t border-[var(--dashboard-border)]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              guardar();
              guardarNombre();
              setUnsaved(false);
            }}
            className="px-3 py-1 rounded bg-white/10 text-sm"
          >
            Guardar
          </button>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenExport((o) => !o)}
              className="px-3 py-1 rounded bg-white/10 text-sm flex items-center gap-1"
            >
              <Download className="w-4 h-4" /> Exportar
            </button>
            {openExport && (
              <div className="absolute right-0 mt-2 bg-[var(--dashboard-navbar)] border border-[var(--dashboard-border)] rounded shadow-md z-10">
                {['pdf','png','svg','json','ics'].map((f) => (
                  <button
                    key={f}
                    onClick={() => {
                      exportar(f);
                      setOpenExport(false);
                    }}
                    className="block px-3 py-1 text-sm text-left hover:bg-white/10 w-full"
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setOpenShare((o) => !o)}
              className="px-3 py-1 rounded bg-white/10 text-sm flex items-center gap-1"
            >
              <Share2 className="w-4 h-4" /> Compartir
            </button>
            {openShare && (
              <div className="absolute right-0 mt-2 bg-[var(--dashboard-navbar)] border border-[var(--dashboard-border)] rounded shadow-md z-10">
                <button
                  onClick={() => {
                    copyLink();
                    setOpenShare(false);
                  }}
                  className="block px-3 py-1 text-sm text-left hover:bg-white/10 w-full"
                >
                  Copiar enlace
                </button>
              </div>
            )}
          </div>
          <button onClick={salir} className="px-3 py-1 rounded bg-white/10 text-sm flex items-center gap-1">
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
        <div className="flex items-center gap-2 border-l border-[var(--dashboard-border)] pl-4">
          <div className="flex items-center gap-1">
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="h-2 w-24"
            />
            <span className="text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
          </div>
          <button onClick={undo} className="px-3 py-1 rounded bg-white/10 text-sm" title="Deshacer">
            ↶
          </button>
          <button onClick={redo} className="px-3 py-1 rounded bg-white/10 text-sm" title="Rehacer">
            ↷
          </button>
          <button onClick={toggleReadOnly} className="px-3 py-1 rounded bg-white/10 text-sm">
            {readOnly ? 'Editar' : 'Presentar'}
          </button>
          <button onClick={onShowHistory} className="px-3 py-1 rounded bg-white/10 text-sm">
            Historial
          </button>
          <button onClick={mostrarCambios} className="px-3 py-1 rounded bg-white/10 text-sm">
            Vista cambios
          </button>
        </div>
        <div className="flex items-center gap-2 border-l border-[var(--dashboard-border)] pl-4">
          <button onClick={mostrarComentarios} className="px-3 py-1 rounded bg-white/10 text-sm">
            Comentarios
          </button>
        </div>
        <div className="flex items-center gap-2 border-l border-[var(--dashboard-border)] pl-4">
          <button onClick={toggleGrid} className="px-3 py-1 rounded bg-white/10 text-sm">
            {showGrid ? 'Ocultar cuadricula' : 'Cuadricula'}
          </button>
          {showGrid && (
            <input
              type="range"
              min="40"
              max="200"
              step="5"
              value={gridSize}
              onChange={e => setGridSize(parseInt(e.target.value))}
              className="h-2 w-24"
            />
          )}
        </div>
        <div className="flex items-center gap-2 border-l border-[var(--dashboard-border)] pl-4">
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenConfig((o) => !o)} className="px-3 py-1 rounded bg-white/10 text-sm">
              Configuración
            </button>
            {openConfig && (
              <div className="absolute right-0 mt-2 bg-[var(--dashboard-navbar)] border border-[var(--dashboard-border)] rounded shadow-md z-10 p-2 text-sm space-y-2">
                <div>
                  <label className="block text-xs">Atajo deshacer</label>
                  <input
                    value={shortcuts.undo}
                    onChange={e => {
                      const val = e.target.value;
                      setShortcuts(s => { const n = { ...s, undo: val }; localStorage.setItem('panel-shortcuts', JSON.stringify(n)); return n; });
                    }}
                    className="w-28 bg-white/10 px-1 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs">Atajo rehacer</label>
                  <input
                    value={shortcuts.redo}
                    onChange={e => {
                      const val = e.target.value;
                      setShortcuts(s => { const n = { ...s, redo: val }; localStorage.setItem('panel-shortcuts', JSON.stringify(n)); return n; });
                    }}
                    className="w-28 bg-white/10 px-1 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs">Color acento</label>
                  <input
                    type="color"
                    defaultValue={typeof window !== 'undefined' ? getComputedStyle(document.documentElement).getPropertyValue('--dashboard-accent').trim() || '#ffe066' : '#ffe066'}
                    onChange={e => {
                      document.documentElement.style.setProperty('--dashboard-accent', e.target.value);
                      document.documentElement.style.setProperty('--dashboard-accent-hover', e.target.value);
                      localStorage.setItem('panel-accent', e.target.value);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenWiki((o) => !o)} className="px-3 py-1 rounded bg-white/10 text-sm">
              Wiki
            </button>
            {openWiki && (
              <div
                className="fixed inset-0 z-40 bg-black/60 flex items-center justify-center"
                onClick={() => setOpenWiki(false)}
              >
                <iframe
                  src="/wiki"
                  className="bg-white w-11/12 h-5/6 rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </div>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenHelp((o) => !o)} className="px-3 py-1 rounded bg-white/10 text-sm">
              Ayuda
            </button>
            {openHelp && (
              <div className="absolute right-0 mt-2 bg-[var(--dashboard-navbar)] border border-[var(--dashboard-border)] rounded shadow-md z-10 p-2 text-sm">
                Usa clic y arrastra para mover widgets.
                Pulsa Guardar para persistir cambios.
              </div>
            )}
          </div>
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOpenTools(o => !o)} className="px-3 py-1 rounded bg-white/10 text-sm">
              Funciones
            </button>
            {openTools && (
              <div className="absolute right-0 mt-2 bg-[var(--dashboard-navbar)] border border-[var(--dashboard-border)] rounded shadow-md z-10 p-2 space-y-2">
                {[
                  {
                    title: 'Gestión',
                    items: [
                      { label: 'Paneles', path: '/dashboard/paneles' },
                      { label: 'Reportes', path: '/dashboard/reportes' },
                      { label: 'Vistas', path: '/dashboard/vistas' },
                    ],
                  },
                  {
                    title: 'Análisis',
                    items: [
                      { label: 'Estadísticas', path: '/dashboard/estadisticas' },
                      { label: 'Timeline', path: '/dashboard/timeline' },
                      { label: 'Actividad', path: '/dashboard/actividad' },
                    ],
                  },
                  {
                    title: 'Diagramas',
                    items: [
                      { label: 'Flujo', path: '/dashboard/flujo' },
                      { label: 'Elementos', path: '/dashboard/elementos' },
                      { label: 'Dependencias', path: '/dashboard/dependencias' },
                      { label: 'IA Visual', path: '/dashboard/ia-visual' },
                    ],
                  },
                  {
                    title: 'Colaboración',
                    items: [
                      { label: 'Narrador', path: '/dashboard/story' },
                      { label: 'Voz', path: '/dashboard/voz' },
                      { label: 'Roles', path: '/dashboard/roles' },
                      { label: 'Gamificación', path: '/dashboard/gamificacion' },
                    ],
                  },
                  {
                    title: 'Utilidades',
                    items: [
                      { label: 'Búsqueda', path: '/dashboard/busqueda' },
                      { label: 'Macros', path: '/dashboard/macros' },
                      { label: 'Admin', path: '/dashboard/admin' },
                    ],
                  },
                ].map(group => (
                  <div key={group.title}>
                    <div className="px-3 py-1 text-xs font-semibold opacity-75">{group.title}</div>
                    {group.items.map(item => (
                      <Link key={item.path} href={item.path} className="block px-3 py-1 text-sm hover:bg-white/10 whitespace-nowrap">
                        {item.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
        {saving === 'saving' && <span className="text-xs text-gray-400">Guardando...</span>}
        {saving === 'saved' && <span className="text-xs text-green-500">Guardado</span>}
    </header>
  );
}
