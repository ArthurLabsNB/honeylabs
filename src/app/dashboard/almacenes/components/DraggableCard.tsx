"use client";
import React, { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Pin, PinOff, Minimize2, Maximize2, X } from "lucide-react";
import { useTabStore, Tab } from "@/hooks/useTabs";
import { usePrompt } from "@/hooks/usePrompt";
import MaterialList from "./MaterialList";
import MaterialForm from "./MaterialForm";
import UnidadesPanel from "../[id]/UnidadesPanel";
import AuditoriasPanel from "../[id]/AuditoriasPanel";
import { useBoard } from "../board/BoardProvider";

function CardContent({ tab }: { tab: Tab }) {
  const { materiales, selectedId, setSelectedId } = useBoard();
  const selected = materiales.find((m) => m.id === selectedId) || null;
  switch (tab.type) {
    case "materiales": {
      const [busqueda, setBusqueda] = React.useState("");
      const [orden, setOrden] = React.useState<"nombre" | "cantidad">("nombre");
      return (
        <MaterialList
          materiales={materiales}
          selectedId={selectedId}
          onSeleccion={setSelectedId}
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          orden={orden}
          setOrden={setOrden}
          onNuevo={() => {}}
          onDuplicar={() => {}}
        />
      );
    }
    case "unidades":
      return (
        <UnidadesPanel
          material={selected}
          onChange={() => {}}
          onSelect={() => {}}
        />
      );
    case "form-material":
      return (
        <MaterialForm
          material={selected}
          onChange={() => {}}
          onGuardar={() => {}}
          onCancelar={() => {}}
          onDuplicar={() => {}}
          onEliminar={() => {}}
        />
      );
    case "auditorias":
      return (
        <AuditoriasPanel
          material={selected}
          almacenId={0}
          onSelectHistorial={() => {}}
        />
      );
    default:
      return <div className="p-4 text-sm text-gray-400">Sin contenido</div>;
  }
}

export default function DraggableCard({ tab }: { tab: Tab }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: tab.id });
  const style = { transform: CSS.Transform.toString(transform), transition } as React.CSSProperties;

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
      {!tab.minimized && !tab.collapsed && <CardContent tab={tab} />}
    </div>
  );
}
