"use client";
import { useEffect } from "react";
import { useTabStore, Tab } from "@/hooks/useTabs";
import { generarUUID } from "@/lib/uuid";
import DraggableTab from "./DraggableTab";
import MaterialList from "./MaterialList";
import MaterialForm from "./MaterialForm";
import UnidadesPanel from "../[id]/UnidadesPanel";
import AuditoriasPanel from "../[id]/AuditoriasPanel";

function TabContent({ tab }: { tab: Tab }) {
  switch (tab.type) {
    case "materiales":
      return <MaterialList materiales={[]} selectedId={null} onSeleccion={() => {}} busqueda="" setBusqueda={() => {}} orden="nombre" setOrden={() => {}} onNuevo={() => {}} onDuplicar={() => {}} />;
    case "form-material":
      return <MaterialForm material={null} onChange={() => {}} onGuardar={() => {}} onCancelar={() => {}} onDuplicar={() => {}} onEliminar={() => {}} />;
    case "unidades":
      return <UnidadesPanel material={null} onChange={() => {}} onSelect={() => {}} />;
    case "auditorias":
      return <AuditoriasPanel material={null} almacenId={0} onSelectHistorial={() => {}} />;
    default:
      return <div className="p-4 text-sm text-gray-400">Sin contenido</div>;
  }
}

export default function TabBoard() {
  const { tabs, activeId, update, add } = useTabStore();

  useEffect(() => {
    if (tabs.length === 0) {
      add({ id: generarUUID(), title: 'Nuevo', type: 'blank' });
    }
  }, [tabs.length, add]);
  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 overflow-x-auto border-b border-[var(--dashboard-border)] py-1">
        {tabs.map((tab, i) => (
          <DraggableTab key={tab.id} tab={tab} index={i} />
        ))}
      </div>
      <div className="flex-1 overflow-y-auto">
        {tabs.map(
          (tab) =>
            tab.id === activeId && !tab.minimized && (
              <div key={tab.id} className={tab.collapsed ? "hidden" : "block"}>
                <TabContent tab={tab} />
              </div>
            ),
        )}
      </div>
      {tabs.map(
        (tab) =>
          tab.popout && (
            <div
              key={"pop-" + tab.id}
              className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
              onClick={() => update(tab.id, { popout: false })}
            >
              <div
                className="bg-[var(--dashboard-bg)] p-4 rounded max-w-5xl w-full max-h-full overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <TabContent tab={tab} />
              </div>
            </div>
          ),
      )}
    </div>
  );
}
