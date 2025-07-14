"use client";

import { useEffect, useState, useRef, useCallback, useReducer } from "react";
import { FOCUS_SEARCH_EVENT } from "@/lib/ui-events";
import { nanoid } from "nanoid";
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
import usePanelSync from "@/hooks/usePanelSync";
import useSubboards from "@/hooks/useSubboards";
import useLayoutPersistence from "@/hooks/useLayoutPersistence";
import { buildMenu, MenuAction } from "../contextMenu";
import GalleryPanel from "../components/GalleryPanel";
import FileDropZone from "../components/FileDropZone";
import HistorySidebar from "../components/HistorySidebar";
import SubboardManager from "../components/SubboardManager";
import Onboarding from "../components/Onboarding";
import { useToast } from "@/components/Toast";
import { usePrompt } from "@/hooks/usePrompt";
import useSelection from "@/hooks/useSelection";
import useTouchZoom from "@/hooks/useTouchZoom";
import useUndoRedo, { type Snapshot } from "@/hooks/useUndoRedo";
import usePanelShortcuts from "@/hooks/usePanelShortcuts";
import type { PanelUpdate, HistEntry } from "@/types/panel";
import { normalizeTipoCuenta, isAdminUser } from "@lib/permisos";

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
  tipos?: string[];
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
  const prompt = usePrompt();
  const params = useParams();
  const panelId = Array.isArray(params?.id) ? params.id[0] : (params as any)?.id;

  const [catalogo, setCatalogo] = useState<WidgetMeta[]>([]);
  interface PanelState { widgets: string[]; layout: LayoutItem[] }
  type PanelAction =
    | { type: 'set'; widgets: string[]; layout: LayoutItem[] }
    | { type: 'setWidgets'; widgets: string[] }
    | { type: 'setLayout'; layout: LayoutItem[] }
  const reducer = (state: PanelState, action: PanelAction): PanelState => {
    switch (action.type) {
      case 'set':
        return { widgets: action.widgets, layout: action.layout };
      case 'setWidgets':
        return { ...state, widgets: action.widgets };
      case 'setLayout':
        return { ...state, layout: action.layout };
      default:
        return state;
    }
  };
  const [panelState, dispatch] = useReducer(reducer, { widgets: [], layout: [] });
  const { widgets, layout } = panelState;
  const setWidgets = (w: string[]) => dispatch({ type: 'setWidgets', widgets: w });
  const setLayout = (l: LayoutItem[]) => dispatch({ type: 'setLayout', layout: l });
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
    setZoom,
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
  const { selected, setSelected, toggle, clear } = useSelection<string>([])
  const [clipboard, setClipboard] = useState<{ key: string; layout: LayoutItem } | null>(null)
  const [diffData, setDiffData] = useState<{ prev: HistEntry; current: HistEntry } | null>(null);
  const [diffList, setDiffList] = useState<HistEntry[]>([]);
  const [diffIndexA, setDiffIndexA] = useState(-2);
  const [diffIndexB, setDiffIndexB] = useState(-1);
  const [historial, setHistorial] = useState<HistEntry[]>([]);
  const { history: undoHist, index: undoIdx, record, undo: undoHistory, redo: redoHistory, reset, skip } = useUndoRedo<Snapshot>({ widgets: [], layout: [] })
  const [readyHistory, setReadyHistory] = useState(false)
  const { setUnsaved } = usePanelOps()
  const [boardBg, setBoardBg] = useState<string>('')
  const [sections, setSections] = useState(1)
  const [isOffline, setIsOffline] = useState(false)
  const [openGallery, setOpenGallery] = useState(false)
  const [openBoards, setOpenBoards] = useState(false)
  const [shortcuts, setShortcuts] = useState(() => {
    if (typeof window === 'undefined') return { undo: 'ctrl+z', redo: 'ctrl+shift+z' }
    try {
      const saved = JSON.parse(localStorage.getItem('panel-shortcuts') || '{}')
      return { undo: 'ctrl+z', redo: 'ctrl+shift+z', ...saved }
    } catch {
      return { undo: 'ctrl+z', redo: 'ctrl+shift+z' }
    }
  })

  useTouchZoom(containerRef, z => setZoom(z))

  const { subboards, activeSub, addSubboard, switchSubboard, saveCurrentSub } =
    useSubboards(panelId, widgets, layout, setWidgets, setLayout)

  usePanelSync(panelId, widgets, layout, setWidgets, setLayout)
  const { save: saveLayout } = useLayoutPersistence(
    panelId,
    widgets,
    layout,
    setWidgets,
    setLayout,
  )

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
    const handleOff = () => {
      setIsOffline(true)
      toast.show('Conexión perdida', 'error')
      saveCurrentSub()
    }
    const handleOn = () => {
      setIsOffline(false);
      toast.show('Conectado', 'success')
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
  }, [panelId, saveCurrentSub]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      saveLayout();
      saveCurrentSub();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveLayout, saveCurrentSub]);


  // 2. Cargar catálogo y componentes de widgets
  useEffect(() => {
    if (!usuario || !panelId) return;

    async function loadWidgets() {
      try {
        const res = await apiFetch("/api/widgets");
        const data = await jsonOrNull(res);
        setCatalogo(data.widgets);

        const mapa: Record<string, any> = {};
        data.widgets.forEach((widget: WidgetMeta) => {
          mapa[widget.key] = dynamic(
            () =>
              import(`../../components/widgets/${widget.file}`).catch(() => {
                setErrores((prev) => ({ ...prev, [widget.key]: true }));
                return { default: () => null };
              }),
            { ssr: false },
          );
        });
        setComponentes(mapa);

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
          const lay = saved.layout.map(it => ({ locked: false, ...it }))
          const wid = saved.widgets
          setWidgets(wid)
          setLayout(lay)
          reset({ widgets: wid, layout: lay })
          setReadyHistory(true)
          if (saved.permiso && setReadOnly) {
            setReadOnly(saved.permiso !== 'edicion')
          }
          setSubboards([{ id: 'main', nombre: 'Principal', permiso: saved.permiso || 'edicion', widgets: wid, layout: lay }])
          setActiveSub('main')
          localStorage.setItem(`panel-subboards-${panelId}`, JSON.stringify([{ id: 'main', nombre: 'Principal', permiso: saved.permiso || 'edicion', widgets: wid, layout: lay }]))
        } else {
          const lay: LayoutItem[] = []
          const wid: string[] = []
          setWidgets(wid)
          setLayout(lay)
          reset({ widgets: wid, layout: lay })
          setReadyHistory(true)
          setReadOnly && setReadOnly(false)
          setSubboards([{ id: 'main', nombre: 'Principal', permiso: 'edicion', widgets: wid, layout: lay }])
          setActiveSub('main')
          localStorage.setItem(`panel-subboards-${panelId}`, JSON.stringify([{ id: 'main', nombre: 'Principal', permiso: 'edicion', widgets: wid, layout: lay }]))
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
    record({ widgets, layout })
    setUnsaved(true)
  }, [widgets, layout])

  useEffect(() => {
    setGuardar(() => guardar);
  }, [guardar, setGuardar]);


  useEffect(() => {
    setMostrarHistorial(() => () => setOpenHist(true));
  }, [setMostrarHistorial]);

  useEffect(() => {
    setMostrarCambios(() => () => setOpenDiff(true));
  }, [setMostrarCambios]);

  useEffect(() => {
    setMostrarComentarios(() => () => setOpenComments(true));
  }, [setMostrarComentarios]);

  useEffect(() => {
    setMostrarChat(() => () => setOpenChat(true));
  }, [setMostrarChat]);

  useEffect(() => {
    return () => {
      saveCurrentSub()
      saveLayout()
    }
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

    const plan = usuario?.plan?.nombre || 'Free'
    const tipo = normalizeTipoCuenta(usuario?.tipoCuenta)
    const admin = isAdminUser(usuario)
    if (!admin && ((widget.plans && !widget.plans.includes(plan)) || (widget.tipos && !widget.tipos.includes(tipo)))) {
      return;
    }

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
    const newKey = `${key}_${nanoid()}`
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
  const newKey = `${key}_${nanoid()}`;
  setWidgets([...widgets, newKey]);
  setLayout([...layout, { ...it, i: newKey, x: it.x + 1, y: it.y + 1, z: (it.z || 0) + 1 }]);
};

const renameWidget = (key: string) => {
  prompt("Nuevo nombre").then(name => {
    if (!name) return;
    setLayout(prev => prev.map(it => it.i === key ? { ...it, label: name } : it));
  });
};

const changeColor = (key: string) => {
  prompt("Color de fondo (hex)", "#ffffff").then(color => {
    if (!color) return;
    setLayout(prev => prev.map(it => it.i === key ? { ...it, bg: color } : it));
  });
};

const assignOwner = (key: string) => {
  prompt('Responsable').then(owner => {
    if (!owner) return;
    setLayout(prev => prev.map(it => it.i === key ? { ...it, owner } : it));
  });
};

const insertTemplate = async () => {
  try {
    const res = await apiFetch('/api/plantillas')
    const data = await jsonOrNull(res)
    const plantilla = data?.plantillas?.[0]
    if (!plantilla?.estado) return
    const keys = plantilla.estado.widgets.map((k: string) => `${k}_${nanoid()}`)
    const maxY = layout.reduce((m, it) => Math.max(m, it.y + (it.h || 0)), 0)
    const maxZ = layout.reduce((m, it) => Math.max(m, it.z || 0), 0)
    setWidgets(w => [...w, ...keys])
    setLayout(l => [
      ...l,
      ...plantilla.estado.layout.map((it: any, i: number) => ({
        ...it,
        i: keys[i] || `${it.i}_${nanoid()}`,
        y: it.y + maxY,
        z: (it.z || 0) + maxZ + i + 1,
      }))
    ])
  } catch {}
}

const iaSuggest = () => {
  const ideas = ['Añadir resumen', 'Crear diagrama', 'Listar tareas'];
  toast.show(`Sugerencia IA: ${ideas[Math.floor(Math.random() * ideas.length)]}`, 'info');
};

const saveTemplate = async () => {
  const nombre = await prompt('Nombre de plantilla')
  if (!nombre) return
  await apiFetch('/api/plantillas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, tipo: 'privada', estado: { widgets, layout } }),
  })
  toast.show('Plantilla guardada', 'success')
}

const generateDiagramAI = () => {
  prompt('Describe el diagrama').then(async desc => {
    if (!desc) return
    const res = await apiFetch('/api/ia', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: desc }) })
    const data = await jsonOrNull(res)
    toast.show(data?.summary || 'IA lista', 'info')
  })
}

const addMedia = (url?: string) => {
  const get = url ? Promise.resolve(url) : prompt('URL del recurso')
  get.then(src => {
    if (!src) return
    const key = `media_${nanoid()}`
    setWidgets(w => [...w, key])
    const maxY = layout.reduce((m, it) => Math.max(m, it.y + (it.h || 0)), 0)
    const maxZ = layout.reduce((m, it) => Math.max(m, it.z || 0), 0)
    setLayout(l => [...l, { i: key, x:0, y:maxY, w:4, h:3, z:maxZ+1, data:{ url: src } }])
  })
}

const handleSelect = (e: React.MouseEvent, id: string) => {
  if (e.ctrlKey || e.metaKey || e.shiftKey) {
    toggle(id, true)
  } else {
    toggle(id)
  }
};

const groupSelected = () => {
  const g = nanoid()
  setLayout(prev => prev.map(it => selected.includes(it.i) ? { ...it, group: g } : it))
  clear()
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
  if (!selected.length) return
  const data = {
    widgets: widgets.filter(k => selected.includes(k)),
    layout: layout.filter(it => selected.includes(it.i)),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `grupo-${panelId}.json`
  a.click()
  URL.revokeObjectURL(url)
  toast.show('Grupo exportado', 'success')
}

const assignGroupSelected = () => {
  prompt('Grupo de trabajo').then(owner => {
    if (!owner) return
    setLayout(prev => prev.map(it => selected.includes(it.i) ? { ...it, owner } : it))
  })
};

const handleMenu = (action: MenuAction, id?: string) => {
  switch (action) {
    case MenuAction.Copy:
      id && copyWidget(id);
      break;
    case MenuAction.Cut:
      id && cutWidget(id);
      break;
    case MenuAction.Duplicate:
      id && duplicateWidget(id);
      break;
    case MenuAction.Delete:
      id && handleRemoveWidget(id);
      break;
    case MenuAction.Rename:
      id && renameWidget(id);
      break;
    case MenuAction.BringFront:
      id && bringToFront(id);
      break;
    case MenuAction.SendBack:
      id && sendToBack(id);
      break;
    case MenuAction.ToggleLock:
      id && toggleLock(id);
      break;
    case MenuAction.Color:
      id && changeColor(id);
      break;
    case MenuAction.Comment:
      if (id) { setActiveWidget(id); setOpenComments(true); }
      break;
    case MenuAction.AssignOwner:
      id && assignOwner(id);
      break;
    case MenuAction.History:
      viewHist();
      break;
    case MenuAction.Group:
      groupSelected();
      break;
    case MenuAction.Align:
      alignSelected();
      break;
    case MenuAction.Distribute:
      distributeSelected();
      break;
    case MenuAction.DuplicateMulti:
      selected.forEach(duplicateWidget);
      break;
    case MenuAction.ExportGroup:
      exportSelected();
      break;
    case MenuAction.AssignGroup:
      assignGroupSelected();
      break;
    case MenuAction.Paste:
      pasteWidget();
      break;
    case MenuAction.NewMarkdown:
      handleAddWidget('markdown');
      break;
    case MenuAction.ToggleGrid:
      toggleGrid();
      break;
    case MenuAction.ChangeBg:
      prompt('Color de fondo', boardBg || '#000000').then(c => { if (c) setBoardBg(c); });
      break;
    case MenuAction.NewSub:
      addSubboard();
      break;
    case MenuAction.SwitchSub:
      if (id) switchSubboard(id);
      break;
    case MenuAction.Search:
      document.dispatchEvent(new Event(FOCUS_SEARCH_EVENT));
      break;
    case MenuAction.InsertTemplate:
      insertTemplate();
      break;
    case MenuAction.SaveTemplate:
      saveTemplate();
      break;
    case MenuAction.OpenGallery:
      setOpenGallery(true);
      break;
    case MenuAction.AddMedia:
      addMedia();
      break;
    case MenuAction.GenerateAI:
      generateDiagramAI();
      break;
    case MenuAction.ConfigRules:
      prompt('Tamaño de cuadrícula', String(gridSize)).then(v => { const n = parseInt(v || ''); if (!Number.isNaN(n)) setGridSize(n); });
      break;
    case MenuAction.IASuggest:
      iaSuggest();
      break;
  }
};


const handleWidgetContext = (e: React.MouseEvent, id: string) => {
  e.preventDefault();
  if (selected.length > 1 && selected.includes(id)) {
    setContextMenu({ type: 'multi', x: e.clientX, y: e.clientY })
  } else {
    toggle(id)
    setContextMenu({ type: "widget", x: e.clientX, y: e.clientY, id });
  }
};

const handleBoardContext = (e: React.MouseEvent) => {
  if ((e.target as HTMLElement).closest(".dashboard-widget-card")) return;
  e.preventDefault();
  clear()
  setContextMenu({ type: "board", x: e.clientX, y: e.clientY });
};

const viewHist = () => {
  toast.show('Historial no implementado', 'info');
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

  const undo = useCallback(() => {
    const snap = undoHistory()
    if (!snap) return
    setWidgets(snap.widgets)
    setLayout(snap.layout)
  }, [undoHistory])

  const redo = useCallback(() => {
    const snap = redoHistory()
    if (!snap) return
    setWidgets(snap.widgets)
    setLayout(snap.layout)
  }, [redoHistory])

  useEffect(() => {
    setUndo(() => undo);
    setRedo(() => redo);
  }, [undo, redo, setUndo, setRedo]);

  usePanelShortcuts(shortcuts, undo, redo)

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

  const plan = usuario.plan?.nombre || 'Free'
  const tipo = normalizeTipoCuenta(usuario.tipoCuenta)
  const admin = isAdminUser(usuario)

  const visible = widgets.filter((k) => {
    if (!buscar) return true;
    const meta = catalogo.find((w) => w.key === k);
    return meta?.title.toLowerCase().includes(buscar.toLowerCase());
  });

  return (
    <div
      ref={containerRef}
      className="min-h-screen p-4 sm:p-8 overflow-auto relative"
      data-oid="japsa91"
      style={{
        ...(showGrid
          ? {
              backgroundSize: `${gridSize * zoom}px ${gridSize * zoom}px`,
              backgroundImage:
                [
                  sections > 1
                    ? `linear-gradient(to right, rgba(255,255,255,0.2) ${2 * zoom}px, transparent ${2 * zoom}px)`
                    : null,
                  'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  'linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                ]
                  .filter(Boolean)
                  .join(', '),
            }
          : sections > 1
          ? {
              backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) ${2 * zoom}px, transparent ${2 * zoom}px)`,
            }
          : {}),
        ...(boardBg ? { backgroundColor: boardBg } : {}),
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
          <select id="subboard-select" value={activeSub} onChange={e => switchSubboard(e.target.value)} className="bg-white/10 text-sm px-2 py-1 rounded">
            {subboards.map(sb => <option key={sb.id} value={sb.id}>{sb.nombre}</option>)}
          </select>
          <button onClick={addSubboard} className="px-2 py-1 bg-white/10 rounded text-sm">+</button>
          <button onClick={() => setOpenBoards(true)} className="px-2 py-1 bg-white/10 rounded text-sm">≡</button>
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
                .filter(
                  (w) =>
                    admin ||
                    ((!w.plans || w.plans.includes(plan)) &&
                      (!w.tipos || w.tipos.includes(tipo)))
                )
                .map((w) => (
                  <option key={w.key} value={w.key} data-oid="i6tnk:1">
                    {w.title}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      <div
        id="panel-area"
        onWheel={e => {
          if (e.ctrlKey) {
            e.preventDefault()
            const delta = e.deltaY > 0 ? -0.1 : 0.1
            setZoom(z => Math.min(2, Math.max(0.5, Math.round((z + delta) * 10) / 10)))
          }
        }}
        style={{ transform: `scale(${zoom})`, transformOrigin: 'top left' }}
      >
      <GridLayout
        layout={layout}
        cols={12}
        rowHeight={gridSize}
        width={1600}
        isResizable={!readOnly}
        resizeHandles={['se','sw','ne','nw']}
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
        style={{ minHeight: "calc(100vh - var(--tabbar-height))" }}
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
      {/* mensaje inicial en pizarras vacías */}
      {!widgets.length && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-400 text-sm">
          Haz clic derecho o usa el botón [+] para agregar tu primer elemento
        </div>
      )}
      </div>
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
              { id: nanoid(), texto: t, autor: usuario.nombre || 'Anon', fecha: new Date().toISOString(), widgetId: wid },
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
      <FileDropZone onFiles={files => files.forEach(f => {
        const url = URL.createObjectURL(f)
        addMedia(url)
      })} />
      <Minimap layout={layout} zoom={zoom} containerRef={containerRef} gridSize={gridSize} />
      <HistorySidebar open={openHist} historial={historial} onClose={() => setOpenHist(false)} restore={restoreVersion} />
      <SubboardManager open={openBoards} boards={subboards} setBoards={setSubboards} onSelect={switchSubboard} onClose={() => setOpenBoards(false)} />
      <Onboarding />
      {contextMenu && (
        <ContextMenu
          position={{ x: contextMenu.x, y: contextMenu.y }}
          onClose={() => setContextMenu(null)}
          items={buildMenu(contextMenu.type, {
            id: contextMenu.id,
            clipboard: !!clipboard,
            layout,
            showGrid,
            subboards,
            activeSub,
          }).map(it => ({
            label: it.label,
            onClick: () => handleMenu(it.action, it.value ?? contextMenu.id),
          }))}
        />
      )}
    </div>
  );
}
