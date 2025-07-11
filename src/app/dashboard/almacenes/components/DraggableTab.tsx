"use client";
import { useRef } from "react";
import { Pencil, Pin, PinOff, Minimize2, Maximize2, X } from "lucide-react";
import { useTabStore, Tab } from "@/hooks/useTabs";
import { usePrompt } from "@/hooks/usePrompt";

export default function DraggableTab({ tab, index }: { tab: Tab; index: number }) {
  const { activeId, setActive, move, update, close, rename } = useTabStore();
  const prompt = usePrompt();
  const ref = useRef<HTMLDivElement>(null);

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("tab-index", String(index));
  };
  const onDrop = (e: React.DragEvent) => {
    const from = Number(e.dataTransfer.getData("tab-index"));
    move(from, index);
  };

  const pin = () => update(tab.id, { pinned: !tab.pinned });
  const toggle = () => update(tab.id, { collapsed: !tab.collapsed });
  const minimize = () => update(tab.id, { minimized: true });
  const maximize = () => update(tab.id, { minimized: false });
  const onRename = async () => {
    const name = await prompt("Renombrar pestaña", tab.title);
    if (name) rename(tab.id, name);
  };
  const popout = (e: React.MouseEvent) => {
    e.preventDefault();
    update(tab.id, { popout: true });
  };

  return (
    <div
      ref={ref}
      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => setActive(tab.id)}
      onDoubleClick={toggle}
      onContextMenu={popout}
      className={`px-2 py-0.5 rounded cursor-pointer select-none flex items-center gap-1 text-sm whitespace-nowrap ${
        activeId === tab.id ? "bg-[var(--dashboard-accent)] text-black" : "bg-[var(--dashboard-sidebar)] text-white"
      }`}
    >
      <span className="px-1">{tab.title}</span>
      <button onClick={onRename} className="p-1 hover:bg-white/20 rounded" title="Renombrar">
        <Pencil className="w-3 h-3" />
      </button>
      <button onClick={pin} className="p-1 hover:bg-white/20 rounded" title="Fijar">
        {tab.pinned ? <Pin className="w-3 h-3" /> : <PinOff className="w-3 h-3" />}
      </button>
      {!tab.pinned && (
        <button onClick={() => close(tab.id)} className="p-1 hover:bg-white/20 rounded" title="Cerrar">
          <X className="w-3 h-3" />
        </button>
      )}
      {tab.minimized ? (
        <button onClick={maximize} className="p-1 hover:bg-white/20 rounded" title="Maximizar">
          <Maximize2 className="w-3 h-3" />
        </button>
      ) : (
        <button onClick={minimize} className="p-1 hover:bg-white/20 rounded" title="Minimizar">
          <Minimize2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
