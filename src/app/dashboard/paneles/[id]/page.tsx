"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import type { Usuario } from "@/types/usuario";
import useSession from "@/hooks/useSession";
import { useParams } from "next/navigation";
import { usePanelOps } from "../PanelOpsContext";

import CommentsPanel from "../components/CommentsPanel";
import ChatPanel from "../components/ChatPanel";
import Minimap from "../components/Minimap";
import ContextMenu from "../components/ContextMenu";
import GalleryPanel from "../components/GalleryPanel";
import { useToast } from "@/components/Toast";

import dynamic from "next/dynamic";
import GridLayout, { Layout } from "react-grid-layout";

type LayoutItem = Layout & { z?: number; locked?: boolean; owner?: string };
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

interface Comment {
  id: number;
  texto: string;
  autor: string;
  fecha: string;
}

export default function PanelPage() {
  const { usuario, loading } = useSession();
  const toast = useToast();
  const params = useParams();
  const panelId = Array.isArray(params?.id) ? params.id[0] : (params as any)?.id;

  const [catalogo, setCatalogo] = useState<WidgetMeta[]>([]);
  const [widgets, setWidgets] = useState<string[]>([]);
  const [layout, setLayout] = useState<LayoutItem[]>([]);
  const [componentes, setComponentes] = useState<{ [key: string]: any }>({});
  const [errores, setErrores] = useState<{ [key: string]: boolean }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    setGuardar,
    setMostrarHistorial,
    setMostrarCambios,
    setMostrarComentarios,
    setMostrarChat,
    setUndo,
    setRedo,
    readOnly,
    setReadOnly,
    showGrid,
    toggleGrid,
    gridSize,
    setGridSize,
    zoom,
    buscar,
  } = usePanelOps();
  const [openHist, setOpenHist] = useState(false);
  const [openDiff, setOpenDiff] = useState(false);
  const [openComments, setOpenComments] = useState(false)
  const [openChat, setOpenChat] = useState(false)
  const [chatChannel, setChatChannel] = useState<number | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [activeWidget, setActiveWidget] = useState<string | undefined>()
  const [contextMenu, setContextMenu] = useState<{ type: 'widget' | 'board' | 'multi'; x: number; y: number; id?: string } | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [clipboard, setClipboard] = useState<{ key: string; layout: LayoutItem } | null>(null)
  const [diffData, setDiffData] = useState<{ prev: HistEntry; current: HistEntry } | null>(null);
  const [diffList, setDiffList] = useState<HistEntry[]>([]);
  const [diffIndexA, setDiffIndexA] = useState(-2);
  const [diffIndexB, setDiffIndexB] = useState(-1);
  const [historial, setHistorial] = useState<HistEntry[]>([]);
  const [undoHist, setUndoHist] = useState<{ widgets: string[]; layout: LayoutItem[] }[]>([])
  const [undoIdx, setUndoIdx] = useState(-1)
  const [readyHistory, setReadyHistory] = useState(false)
  const skipHistory = useRef(false)
  const { setUnsaved } = usePanelOps()
  const bcRef = useRef<BroadcastChannel | null>(null)
  const clientId = useRef<string>(Math.random().toString(36).slice(2))
  const [boardBg, setBoardBg] = useState<string>('')
  const [sections, setSections] = useState(1)
  const [subboards, setSubboards] = useState<{id:string; nombre:string; permiso:'edicion'|'lectura'; widgets:string[]; layout: LayoutItem[]}[]>([])
  const [activeSub, setActiveSub] = useState('')
  const [isOffline, setIsOffline] = useState(false)
  const [openGallery, setOpenGallery] = useState(false)
  const [shortcuts, setShortcuts] = useState(() => {
    if (typeof window === 'undefined') return { undo: 'ctrl+z', redo: 'ctrl+shift+z' }
    try {
      const saved = JSON.parse(localStorage.getItem('panel-shortcuts') || '{}')
      return { undo: 'ctrl+z', redo: 'ctrl+shift+z', ...saved }
    } catch {
      return { undo: 'ctrl+z', redo: 'ctrl+shift+z' }
    }
  })

  useEffect(() => {
    if (!panelId) return
    const bc = new BroadcastChannel(`panel-sync-${panelId}`)
    bcRef.current = bc
    const handle = (
      e: MessageEvent<{ widgets: string[]; layout: LayoutItem[]; client?: string }>,
    ) => {
      const { widgets: w, layout: l, client } = e.data || {}
      if (client === clientId.current) return
      if (!Array.isArray(w) || !Array.isArray(l)) return
      skipHistory.current = true
      setWidgets(w)
      setLayout(l as LayoutItem[])
      toast.show('Pizarra actualizada', 'info')
    }
    bc.addEventListener('message', handle)
    bc.postMessage({ client: clientId.current, widgets, layout })
    return () => {
      bc.removeEventListener('message', handle)
      bc.close()
      bcRef.current = null
    }
  }, [panelId])

  useEffect(() => {
    if (!openChat || !usuario || !panelId) return
    ;(async () => {
      try {
        const res = await apiFetch('/api/chat/canales')
        const data = await jsonOrNull(res)
        let canal = data?.canales?.find((c: any) => c.nombre === `panel-${panelId}`)
        if (!canal) {
          const resNew = await apiFetch('/api/chat/canales', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre: `panel-${panelId}` }),
          })
          const d = await jsonOrNull(resNew)
          canal = d.canal
        }
        setChatChannel(canal.id)
      } catch {}
    })()
  }, [openChat, usuario, panelId])

  useEffect(() => {
    const handleOff = () => { setIsOffline(true); saveCurrentSub(); };
    const handleOn = () => {
      setIsOffline(false);
      const data = localStorage.getItem(`panel-offline-${panelId}`);
      if (data) {
        apiFetch(`/api/paneles/${panelId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: data
        }).then(() => localStorage.removeItem(`panel-offline-${panelId}`)).catch(()=>{});
      }
    };
    window.addEventListener('offline', handleOff);
    window.addEventListener('online', handleOn);
    setIsOffline(!navigator.onLine);
    return () => {
      window.removeEventListener('offline', handleOff);
      window.removeEventListener('online', handleOn);
    };
  }, [panelId]);


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
          locked: false,
        }));
        let saved: { widgets: string[]; layout: LayoutItem[]; permiso?: string } | null = null;
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

          const lay = (filteredLayout.length ? filteredLayout : defaultLayout).map(it => ({ locked: false, ...it }))
          const wid = filteredWidgets.length ? filteredWidgets : validKeys
          const board = { id: 'main', nombre: 'Principal', permiso: saved.permiso || 'edicion', widgets: wid, layout: lay }
          let boards: typeof subboards = []
          try { boards = JSON.parse(localStorage.getItem(`panel-subboards-${panelId}`) || '[]') } catch {}
          if (!boards.length) boards = [board]; else boards[0] = { ...boards[0], ...board }
          setSubboards(boards)
          setActiveSub(boards[0].id)
          setWidgets(boards[0].widgets)
          setLayout(boards[0].layout)
          setUndoHist([{ widgets: boards[0].widgets, layout: boards[0].layout }])
          setUndoIdx(0)
          setReadyHistory(true)
          if (saved.permiso && setReadOnly) {
            setReadOnly(saved.permiso !== 'edicion')
          }
          localStorage.setItem(`panel-subboards-${panelId}`, JSON.stringify(boards))
        } else {
          const lay = defaultLayout.map(it => ({ locked: false, ...it }))
          const wid = permitidos.map((w: WidgetMeta) => w.key)
          const board = { id: 'main', nombre: 'Principal', permiso: 'edicion', widgets: wid, layout: lay }
          let boards: typeof subboards = []
          try { boards = JSON.parse(localStorage.getItem(`panel-subboards-${panelId}`) || '[]') } catch {}
          if (!boards.length) boards = [board]; else boards[0] = { ...boards[0], ...board }
          setSubboards(boards)
          setActiveSub(boards[0].id)
          setWidgets(boards[0].widgets)
          setLayout(boards[0].layout)
          setUndoHist([{ widgets: boards[0].widgets, layout: boards[0].layout }])
          setUndoIdx(0)
          setReadyHistory(true)
          setReadOnly && setReadOnly(false)
          localStorage.setItem(`panel-subboards-${panelId}`, JSON.stringify(boards))
        }
      } catch (err) {
        console.error("Error al cargar widgets:", err);
      }
    }

    loadWidgets();
  }, [usuario, panelId]);

  const guardar = useCallback(async () => {
    if (!usuario || !panelId) return;
    const data = { widgets, layout };
    if (!navigator.onLine) {
      localStorage.setItem(`panel-offline-${panelId}`, JSON.stringify(data));
      return;
    }
    await apiFetch(`/api/paneles/${panelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).catch(() => {});
    setUnsaved(false);
  }, [usuario, panelId, widgets, layout, setUnsaved]);

  // Guardar en DB y registrar historial local
  useEffect(() => {
    if (!readyHistory) return
    guardar()
    saveCurrentSub()
    if (skipHistory.current) {
      skipHistory.current = false
      return
    }
    setUndoHist((h) => [...h.slice(0, undoIdx + 1), { widgets, layout }])
    setUndoIdx((i) => i + 1)
    setUnsaved(true)
    bcRef.current?.postMessage({ client: clientId.current, widgets, layout })
  }, [widgets, layout])

  useEffect(() => {
    setGuardar(() => guardar);
  }, [guardar]);


  useEffect(() => {
    setMostrarHistorial(() => () => setOpenHist(true));
  }, []);

  useEffect(() => {
    setMostrarCambios(() => () => setOpenDiff(true));
  }, []);

  useEffect(() => {
    setMostrarComentarios(() => () => setOpenComments(true));
  }, []);

  useEffect(() => {
    setMostrarChat(() => () => setOpenChat(true));
  }, []);

  useEffect(() => {
    return () => saveCurrentSub()
  }, [])

  

  useEffect(() => {
    if (!openHist || !usuario || !panelId) return;
    apiFetch(`/api/paneles/${panelId}/historial`)
      .then(jsonOrNull)
      .then((d) => setHistorial(d.historial || []))
      .catch(() => {});
  }, [openHist, usuario, panelId]);

  useEffect(() => {
    if (!openDiff || !usuario || !panelId) return;
    apiFetch(`/api/paneles/${panelId}/historial`)
      .then(jsonOrNull)
      .then((d) => {
        const h: HistEntry[] = d.historial || [];
        setDiffList(h);
        if (h.length >= 2) {
          setDiffIndexA(h.length - 2);
          setDiffIndexB(h.length - 1);
        } else {
          setDiffIndexA(-1);
          setDiffIndexB(-1);
        }
      })
      .catch(() => {});
  }, [openDiff, usuario, panelId]);

  useEffect(() => {
    if (diffIndexA < 0 || diffIndexB < 0) {
      setDiffData(null);
      return;
    }
    if (diffList[diffIndexA] && diffList[diffIndexB]) {
      setDiffData({ prev: diffList[diffIndexA], current: diffList[diffIndexB] });
    }
  }, [diffIndexA, diffIndexB, diffList]);

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

  const duplicateWidget = (key: string) => {
    const orig = layout.find((l) => l.i === key)
    if (!orig) return
    const newKey = `${key}_${Date.now()}`
    setWidgets([...widgets, newKey])
    setLayout([
      ...layout,
      { ...orig, i: newKey, x: orig.x + 1, y: orig.y + 1, z: (orig.z || 0) + 1 },
    ])
  }
const sendToBack = (key: string) => {
  setLayout(prev => {
    const minZ = prev.reduce((m, it) => Math.min(m, it.z || 0), Infinity);
    return prev.map(it => it.i === key ? { ...it, z: minZ - 1 } : it);
  });
};

const copyWidget = (key: string) => {
  const item = layout.find(l => l.i === key);
  if (!item) return;
  setClipboard({ key, layout: { ...item } });
};

const cutWidget = (key: string) => {
  copyWidget(key);
  handleRemoveWidget(key);
};

const pasteWidget = () => {
  if (!clipboard) return;
  const { key, layout: it } = clipboard;
  const newKey = `${key}_${Date.now()}`;
  setWidgets([...widgets, newKey]);
  setLayout([...layout, { ...it, i: newKey, x: it.x + 1, y: it.y + 1, z: (it.z || 0) + 1 }]);
};

const renameWidget = (key: string) => {
  const name = prompt("Nuevo nombre")?.trim();
  if (!name) return;
  setLayout(prev => prev.map(it => it.i === key ? { ...it, label: name } : it));
};

const changeColor = (key: string) => {
  const color = prompt("Color de fondo (hex)", "#ffffff")?.trim();
  if (!color) return;
  setLayout(prev => prev.map(it => it.i === key ? { ...it, bg: color } : it));
};

const assignOwner = (key: string) => {
  const owner = prompt('Responsable')?.trim();
  if (!owner) return;
  setLayout(prev => prev.map(it => it.i === key ? { ...it, owner } : it));
};

const insertTemplate = () => {
  const keys = ['markdown', 'markdown', 'markdown'].map(k => `${k}_${Date.now()}_${Math.random().toString(16).slice(2)}`);
  setWidgets(w => [...w, ...keys]);
  const maxY = layout.reduce((m, it) => Math.max(m, it.y + (it.h || 0)), 0);
  const maxZ = layout.reduce((m, it) => Math.max(m, it.z || 0), 0);
  setLayout(l => [
    ...l,
    ...keys.map((k, i) => ({ i: k, x: i * 2, y: maxY, w: 2, h: 2, z: maxZ + i + 1 })),
  ]);
};

const iaSuggest = () => {
  const ideas = ['Añadir resumen', 'Crear diagrama', 'Listar tareas'];
  alert(`Sugerencia IA: ${ideas[Math.floor(Math.random() * ideas.length)]}`);
};

const generateDiagramAI = () => {
  const desc = prompt('Describe el diagrama')?.trim()
  if (!desc) return
  const parts = desc.split(/\s+/).slice(0,3)
  const keys = parts.map(() => `markdown_${Date.now()}_${Math.random().toString(16).slice(2)}`)
  setWidgets(w => [...w, ...keys])
  const maxY = layout.reduce((m, it) => Math.max(m, it.y + (it.h || 0)), 0)
  const maxZ = layout.reduce((m, it) => Math.max(m, it.z || 0), 0)
  setLayout(l => [
    ...l,
    ...keys.map((k,i)=>({ i:k, x:i*2, y:maxY, w:2, h:2, z:maxZ+i+1, label: parts[i] || `Paso ${i+1}` }))
  ])
}

const addMedia = (url?: string) => {
  const src = url || prompt('URL del recurso')?.trim()
  if (!src) return
  const key = `media_${Date.now()}`
  setWidgets(w => [...w, key])
  const maxY = layout.reduce((m, it) => Math.max(m, it.y + (it.h || 0)), 0)
  const maxZ = layout.reduce((m, it) => Math.max(m, it.z || 0), 0)
  setLayout(l => [...l, { i: key, x:0, y:maxY, w:4, h:3, z:maxZ+1, data:{ url: src } }])
}

const handleSelect = (e: React.MouseEvent, id: string) => {
  if (e.ctrlKey || e.metaKey || e.shiftKey) {
    setSelected(prev => prev.includes(id) ? prev.filter(k => k !== id) : [...prev, id])
  } else {
    setSelected([id])
  }
};

const groupSelected = () => {
  const g = Date.now().toString()
  setLayout(prev => prev.map(it => selected.includes(it.i) ? { ...it, group: g } : it))
  setSelected([])
};

const alignSelected = () => {
  const base = layout.find(it => it.i === selected[0])
  if (!base) return
  setLayout(prev => prev.map(it => selected.includes(it.i) ? { ...it, y: base.y } : it))
};

const distributeSelected = () => {
  const items = layout.filter(it => selected.includes(it.i)).sort((a,b) => a.x - b.x)
  if (items.length < 3) return
  const first = items[0]
  const last = items[items.length - 1]
  const step = (last.x - first.x) / (items.length - 1)
  setLayout(prev => prev.map(it => {
    const idx = items.findIndex(t => t.i === it.i)
    return idx !== -1 ? { ...it, x: Math.round(first.x + step * idx) } : it
  }))
};

const exportSelected = () => {
  alert('Exportando grupo...')
};

const assignGroupSelected = () => {
  const owner = prompt('Grupo de trabajo')?.trim()
  if (!owner) return
  setLayout(prev => prev.map(it => selected.includes(it.i) ? { ...it, owner } : it))
};

const saveCurrentSub = () => {
  setSubboards(bs => bs.map(b => b.id === activeSub ? { ...b, widgets, layout } : b))
  const updated = subboards.map(b => b.id === activeSub ? { ...b, widgets, layout } : b)
  localStorage.setItem(`panel-subboards-${panelId}`, JSON.stringify(updated))
};

const switchSubboard = (id: string) => {
  saveCurrentSub()
  const sb = subboards.find(s => s.id === id)
  if (!sb) return
  setActiveSub(id)
  setWidgets(sb.widgets)
  setLayout(sb.layout)
};

const addSubboard = () => {
  const nombre = prompt('Nombre del área')?.trim()
  if (!nombre) return
  saveCurrentSub()
  const nuevo = { id: Date.now().toString(), nombre, permiso: 'edicion' as const, widgets: [], layout: [] }
  const list = [...subboards, nuevo]
  setSubboards(list)
  setActiveSub(nuevo.id)
  setWidgets([])
  setLayout([])
  localStorage.setItem(`panel-subboards-${panelId}`, JSON.stringify(list))
};

const handleWidgetContext = (e: React.MouseEvent, id: string) => {
  e.preventDefault();
  if (selected.length > 1 && selected.includes(id)) {
    setContextMenu({ type: 'multi', x: e.clientX, y: e.clientY })
  } else {
    setSelected([id])
    setContextMenu({ type: "widget", x: e.clientX, y: e.clientY, id });
  }
};

const handleBoardContext = (e: React.MouseEvent) => {
  if ((e.target as HTMLElement).closest(".dashboard-widget-card")) return;
  e.preventDefault();
  setSelected([])
  setContextMenu({ type: "board", x: e.clientX, y: e.clientY });
};

const viewHist = () => {
  alert("Historial no implementado");
};

  const toggleLock = (key: string) => {
    setLayout((prev) =>
      prev.map((it) => (it.i === key ? { ...it, locked: !it.locked } : it)),
    )
  }

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

  useEffect(() => {
    setUndo(() => undo);
    setRedo(() => redo);
  }, [undo, redo, setUndo, setRedo]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      const match = (combo: string) => {
        const parts = combo.toLowerCase().split('+')
        const key = parts.pop()
        const ctrl = parts.includes('ctrl')
        const shift = parts.includes('shift')
        const alt = parts.includes('alt')
        return (
          (!!key && e.key.toLowerCase() === key) &&
          (!!ctrl === e.ctrlKey) && (!!shift === e.shiftKey) && (!!alt === e.altKey)
        )
      }
      if (match(shortcuts.undo)) {
        e.preventDefault()
        undo()
      } else if (match(shortcuts.redo)) {
        e.preventDefault()
        redo()
      }
    }
    window.addEventListener('keydown', handle)
    return () => window.removeEventListener('keydown', handle)
  }, [undo, redo, shortcuts])

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

  const visible = widgets.filter((k) => {
    if (!buscar) return true;
    const meta = catalogo.find((w) => w.key === k);
    return meta?.title.toLowerCase().includes(buscar.toLowerCase());
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-4 sm:p-8 overflow-auto"
      data-oid="japsa91"
      style={{
        ...(showGrid
          ? {
              backgroundSize: `${gridSize}px ${gridSize}px`,
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
            }
          : {}),
        ...(boardBg ? { backgroundColor: boardBg } : {}),
        ...(sections > 1
          ? {
              backgroundImage:
                'linear-gradient(to right, rgba(255,255,255,0.2) 2px, transparent 2px),' +
                (showGrid
                  ? 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)'
                  : ''),
            }
          : {}),
      }}
      onDragOver={e => e.preventDefault()}
      onDrop={e => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            const url = reader.result as string;
            addMedia(url);
          };
          reader.readAsDataURL(file);
        }
      }}
      onContextMenu={handleBoardContext}
      onWheel={e => {
        if (e.ctrlKey) {
          e.preventDefault()
          const delta = e.deltaY > 0 ? -0.1 : 0.1
          setZoom(z => Math.min(2, Math.max(0.5, Math.round((z + delta)*10)/10)))
        }
      }}
    >
      <div
        className="flex items-center justify-between mb-5"
        data-oid="zm1.jco"
      >
        <h1 className="text-2xl font-bold" data-oid="ulnh9zq">
          Panel
        </h1>
        {isOffline && <span className="text-xs text-red-500 mr-2">Offline</span>}
        <div className="flex items-center gap-2" data-oid="kuayohc">
          <select value={activeSub} onChange={e => switchSubboard(e.target.value)} className="bg-white/10 text-sm px-2 py-1 rounded">
            {subboards.map(sb => <option key={sb.id} value={sb.id}>{sb.nombre}</option>)}
          </select>
          <button onClick={addSubboard} className="px-2 py-1 bg-white/10 rounded text-sm">+</button>
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

      <div id="panel-area" style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}>
      <GridLayout
        layout={layout}
        cols={12}
        rowHeight={gridSize}
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
              const found = prev.find((p) => p.i === it.i)
              if (found?.locked) return found
              return { ...found, ...it } as LayoutItem
            }),
          )
        }
        draggableHandle=".dashboard-widget-card"
        margin={[Math.round(gridSize / 5), Math.round(gridSize / 5)]}
        data-oid="hxrbk.e"
        style={{ minHeight: "100vh" }}
      >
        {visible.map((key) => {
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
              className={`dashboard-widget-card${selected.includes(key) ? ' dashboard-widget-selected' : ''}`}
              style={{ zIndex: item?.z || 1, backgroundColor: (item as any)?.bg }}
              onMouseDown={() => bringToFront(key)}
              onClick={e => handleSelect(e, key)}
              onContextMenu={e => handleWidgetContext(e, key)}
              data-oid="ldgxhem"
            >
              {item?.label && (
                <div className="absolute top-1 left-1 text-xs font-semibold pointer-events-none">
                  {item.label}
                </div>
              )}
              {item?.owner && (
                <div className="absolute bottom-1 left-1 text-[10px] pointer-events-none bg-black/50 text-white px-1 rounded">
                  {item.owner}
                </div>
              )}
              <Widget usuario={usuario} panelId={panelId} url={(item as any)?.data?.url} data-oid="c3illgc" />
              {!readOnly && (
                <div className="absolute top-1 right-1 flex gap-1 text-xs">
                  <button
                    onClick={() => handleRemoveWidget(key)}
                    title="Eliminar"
                    className="text-gray-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => duplicateWidget(key)}
                    title="Duplicar"
                    className="text-gray-400 hover:text-green-500"
                  >
                    ⧉
                  </button>
                  <button
                    onClick={() => { setActiveWidget(key); setOpenComments(true); }}
                    title="Comentar"
                    className="text-gray-400 hover:text-blue-500"
                  >
                    💬
                  </button>
                  <button
                    onClick={() => toggleLock(key)}
                    title={item?.locked ? 'Desbloquear' : 'Bloquear'}
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    {item?.locked ? '🔓' : '🔒'}
                  </button>
                </div>
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
      {openDiff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
          <div className="bg-[var(--dashboard-card)] p-4 rounded max-h-[80vh] overflow-auto w-[90vw] sm:w-[70vw]">
            <h2 className="font-semibold mb-2">Vista de cambios</h2>
            {diffList.length >= 2 ? (
              <>
                <div className="flex gap-2 text-xs mb-2">
                  <select
                    value={diffIndexA}
                    onChange={(e) => setDiffIndexA(Number(e.target.value))}
                    className="border p-1 rounded"
                  >
                    {diffList.map((h, i) => (
                      <option key={i} value={i}>
                        {new Date(h.fecha).toLocaleString()}
                      </option>
                    ))}
                  </select>
                  <select
                    value={diffIndexB}
                    onChange={(e) => setDiffIndexB(Number(e.target.value))}
                    className="border p-1 rounded"
                  >
                    {diffList.map((h, i) => (
                      <option key={i} value={i}>
                        {new Date(h.fecha).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>
                {diffData && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <pre className="p-2 bg-black/20 rounded overflow-auto whitespace-pre-wrap">
{JSON.stringify(diffData.prev.estado, null, 2)}
</pre>
                    <pre className="p-2 bg-black/20 rounded overflow-auto whitespace-pre-wrap">
{JSON.stringify(diffData.current.estado, null, 2)}
</pre>
                  </div>
                )}
              </>
            ) : (
              <p>No hay versiones suficientes.</p>
            )}
            <button onClick={() => setOpenDiff(false)} className="mt-3 px-3 py-1 bg-white/10 rounded w-full text-sm">Cerrar</button>
          </div>
        </div>
      )}
      {openComments && (
        <CommentsPanel
          comentarios={comments.filter(c => !activeWidget || c.widgetId === activeWidget)}
          onAdd={(t, wid) =>
            setComments((c) => [
              ...c,
              { id: Date.now(), texto: t, autor: usuario.nombre || 'Anon', fecha: new Date().toISOString(), widgetId: wid },
            ])
          }
          widgetId={activeWidget}
        />
      )}
      {openChat && chatChannel !== null && <ChatPanel canalId={chatChannel} />}
      {openGallery && (
        <GalleryPanel
          images={["/gallery/icon1.svg", "/gallery/icon2.svg", "/gallery/icon3.svg"]}
          onSelect={url => addMedia(url)}
          onClose={() => setOpenGallery(false)}
        />
      )}
      <Minimap layout={layout} zoom={zoom} containerRef={containerRef} gridSize={gridSize} />
      {contextMenu && (
        <ContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          items={contextMenu.type === "widget" ? [
            { label: "Copiar", onClick: () => copyWidget(contextMenu.id!) },
            { label: "Cortar", onClick: () => cutWidget(contextMenu.id!) },
            { label: "Duplicar", onClick: () => duplicateWidget(contextMenu.id!) },
            { label: "Eliminar", onClick: () => handleRemoveWidget(contextMenu.id!) },
            { label: "Renombrar", onClick: () => renameWidget(contextMenu.id!) },
            { label: "Traer al frente", onClick: () => bringToFront(contextMenu.id!) },
            { label: "Enviar al fondo", onClick: () => sendToBack(contextMenu.id!) },
            { label: layout.find(l => l.i === contextMenu.id)?.locked ? "Desbloquear" : "Bloquear", onClick: () => toggleLock(contextMenu.id!) },
            { label: "Color", onClick: () => changeColor(contextMenu.id!) },
            { label: "Comentario", onClick: () => { setActiveWidget(contextMenu.id); setOpenComments(true); } },
            { label: "Asignar responsable", onClick: () => assignOwner(contextMenu.id!) },
            { label: "Historial", onClick: viewHist }
          ] : contextMenu.type === 'multi' ? [
            { label: 'Agrupar', onClick: groupSelected },
            { label: 'Alinear', onClick: alignSelected },
            { label: 'Distribuir', onClick: distributeSelected },
            { label: 'Duplicar', onClick: () => selected.forEach(duplicateWidget) },
            { label: 'Exportar grupo', onClick: exportSelected },
            { label: 'Asignar a grupo', onClick: assignGroupSelected }
          ] : [
            ...(clipboard ? [{ label: "Pegar", onClick: pasteWidget }] : []),
            { label: "Nuevo Markdown", onClick: () => handleAddWidget("markdown") },
            { label: showGrid ? "Ocultar cuadrícula" : "Mostrar cuadrícula", onClick: toggleGrid },
            { label: "Cambiar fondo", onClick: () => { const c = prompt('Color de fondo', boardBg || '#000000'); if (c) setBoardBg(c); } },
            { label: 'Nueva subpizarra', onClick: addSubboard },
            ...subboards.filter(b => b.id !== activeSub).map(b => ({ label: `Cambiar a ${b.nombre}`, onClick: () => switchSubboard(b.id) })),
            { label: 'Buscar elemento', onClick: () => document.dispatchEvent(new Event('focus-search')) },
            { label: 'Insertar plantilla', onClick: insertTemplate },
            { label: 'Abrir galería', onClick: () => setOpenGallery(true) },
            { label: 'Agregar media', onClick: () => addMedia() },
            { label: 'Generar diagrama IA', onClick: generateDiagramAI },
            { label: 'Configurar reglas', onClick: () => { const v = prompt('Tamaño de cuadrícula', String(gridSize)); const n = parseInt(v || ''); if (!Number.isNaN(n)) setGridSize(n); } },
            { label: 'Sugerencia IA', onClick: iaSuggest }
          ]}
        />
      )}
    </div>
  );
}
