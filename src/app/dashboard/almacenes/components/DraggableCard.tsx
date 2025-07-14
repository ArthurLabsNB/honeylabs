"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Pin, PinOff, Minimize2, Maximize2, X } from "lucide-react";
import { useTabStore, Tab } from "@/hooks/useTabs";
import { usePrompt } from "@/hooks/usePrompt";
import MaterialesTab from "./tabs/MaterialesTab";
import UnidadesTab from "./tabs/UnidadesTab";
import MaterialFormTab from "./tabs/MaterialFormTab";
import AuditoriasTab from "./tabs/AuditoriasTab";
import UnidadFormTab from "./tabs/UnidadFormTab";
import AuditoriaFormTab from "./tabs/AuditoriaFormTab";
import BoardCard from "./BoardCard";
import UrlCard from "./UrlCard";

function CardBody({ tab }: { tab: Tab }) {
  switch (tab.type) {
    case "materiales":
      return <MaterialesTab />;
    case "unidades":
      return <UnidadesTab />;
    case "form-material":
      return <MaterialFormTab tabId={tab.id} />;
    case "auditorias":
      return <AuditoriasTab />;
    case "form-unidad":
      return <UnidadFormTab tabId={tab.id} />;
    case "form-auditoria":
      return <AuditoriaFormTab tabId={tab.id} />;
    case "board":
      return <BoardCard board={tab.boardId} />;
    case "url":
      return <UrlCard url={tab.url} />;
    default:
      return <div className="p-4 text-sm text-gray-400">Sin contenido</div>;
  }
}


export default function DraggableCard({ tab }: { tab: Tab }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tab.id });
  const style = {
    transform: `${CSS.Transform.toString(transform)}${isDragging ? ' scale(1.05)' : ''}`,
    transition,
    zIndex: isDragging ? 50 : undefined,
    boxShadow: isDragging ? '0 10px 15px rgba(0,0,0,0.3)' : undefined,
  } as React.CSSProperties;

  const { update, close, rename } = useTabStore();
  const prompt = usePrompt();

  const stop = (e: React.PointerEvent) => e.stopPropagation();

  const pin = () => update(tab.id, { pinned: !tab.pinned });
  const toggle = () => update(tab.id, { collapsed: !tab.collapsed });
  const minimize = () => update(tab.id, { minimized: true });
  const maximize = () => update(tab.id, { minimized: false });
  const onRename = async () => {
    const name = await prompt("Renombrar tarjeta", tab.title);
    if (name) rename(tab.id, name);
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="dashboard-card resize overflow-auto">
      <div className="flex items-center justify-between mb-2 cursor-move" {...listeners}>
        <span className="font-semibold" onDoubleClick={toggle}>{tab.title}</span>
        <div className="flex items-center gap-1">
          <button onPointerDown={stop} onClick={onRename} className="p-1 hover:bg-white/10 rounded" title="Renombrar">
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onPointerDown={stop}
            onClick={(e) => {
              stop(e);
              pin();
            }}
            className="p-1 hover:bg-white/10 rounded"
            title="Fijar"
          >
            {tab.pinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
          </button>
          {!tab.pinned && (
            <button
              onPointerDown={stop}
              onClick={(e) => {
                stop(e);
                close(tab.id);
              }}
              className="p-1 hover:bg-white/10 rounded"
              title="Cerrar"
            >
              <X className="w-3 h-3" />
            </button>
          )}
          {tab.minimized ? (
            <button onPointerDown={stop} onClick={maximize} className="p-1 hover:bg-white/10 rounded" title="Maximizar">
              <Maximize2 className="w-3 h-3" />
            </button>
          ) : (
            <button onPointerDown={stop} onClick={minimize} className="p-1 hover:bg-white/10 rounded" title="Minimizar">
              <Minimize2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
      {!tab.minimized && !tab.collapsed && <CardBody tab={tab} />}
    </div>
  );
}
