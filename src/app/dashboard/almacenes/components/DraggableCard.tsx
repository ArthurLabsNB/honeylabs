"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Pencil, Pin, PinOff, X } from "lucide-react";
import { useTabStore, Tab } from "@/hooks/useTabs";
import { usePrompt } from "@/hooks/usePrompt";
import MaterialesTab from "./tabs/MaterialesTab";
import UnidadesTab from "./tabs/UnidadesTab";
import MaterialFormTab from "./tabs/MaterialFormTab";
import AuditoriasTab from "./tabs/AuditoriasTab";
import UnidadFormTab from "./tabs/UnidadFormTab";
import AuditoriaFormTab from "./tabs/AuditoriaFormTab";
import NotasTab from "./tabs/NotasTab";
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
    case "notas":
      return <NotasTab tabId={tab.id} />;
    case "board":
      return <BoardCard board={tab.boardId} />;
    case "url":
      return <UrlCard url={tab.url} />;
    default:
      return <div className="p-4 text-sm text-gray-400">Sin contenido</div>;
  }
}


interface Props {
  tab: Tab;
  grid?: boolean;
  onMove?: (dir: 'left' | 'right' | 'up' | 'down') => void;
  onDrop?: () => void;
}

export default function DraggableCard({ tab, grid = false, onMove, onDrop }: Props) {
  const sortable = !grid;
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    sortable ? useSortable({ id: tab.id }) : ({} as any);
  const style = sortable
    ? ({
        transform: `${CSS.Transform.toString(transform)}${isDragging ? ' scale(1.05)' : ''}`,
        transition,
        zIndex: isDragging ? 50 : undefined,
        boxShadow: isDragging ? '0 10px 15px rgba(0,0,0,0.3)' : undefined,
      } as React.CSSProperties)
    : undefined;

  const { update, close, rename } = useTabStore();
  const prompt = usePrompt();

  const stop = (e: React.PointerEvent) => e.stopPropagation();

  const pin = () => update(tab.id, { pinned: !tab.pinned });
  const toggle = () => update(tab.id, { collapsed: !tab.collapsed });
  const onRename = async () => {
    const name = await prompt("Renombrar tarjeta", tab.title);
    if (name) rename(tab.id, name);
  };

  const content = (
      <motion.div
        ref={sortable ? setNodeRef : undefined}
        style={style}
        {...(sortable ? attributes : {})}
        className={cn("dashboard-card overflow-auto", grid && "h-full")}
        whileDrag={sortable ? { scale: 1.05 } : undefined}
        tabIndex={0}
        role="listitem"
        onKeyDown={(e) => {
          if (!onMove) return;
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onMove('left');
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            onMove('right');
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            onMove('up');
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            onMove('down');
          } else if (e.key === 'Enter' || e.key === ' ') {
            onDrop?.();
          }
        }}
      >
      <div className="flex items-center justify-between mb-2">
        <div className="drag-handle cursor-move" {...(sortable ? listeners : {})}>
          <span className="font-semibold" onDoubleClick={toggle}>{tab.title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onPointerDown={stop} onClick={onRename} className="no-drag p-1 hover:bg-white/10 rounded" title="Renombrar">
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onPointerDown={stop}
            onClick={(e) => {
              stop(e);
              pin();
            }}
            className="no-drag p-1 hover:bg-white/10 rounded"
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
              className="no-drag p-1 hover:bg-white/10 rounded"
              title="Cerrar"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
        {!tab.collapsed && <CardBody tab={tab} />}
      </motion.div>
  );

  return content;
}
