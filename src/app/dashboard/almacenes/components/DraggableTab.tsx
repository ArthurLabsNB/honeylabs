"use client";
import { useRef } from "react";
import { Pencil, Pin, PinOff, X } from "lucide-react";
import { useTabStore, Tab } from "@/hooks/useTabs";
import { usePrompt } from "@/hooks/usePrompt";

interface Props {
  tab: Tab;
  index: number;
  draggable?: boolean;
}

export default function DraggableTab({ tab, index, draggable = true }: Props) {
  const { activeId, setActive, update, close, rename } = useTabStore();
  const prompt = usePrompt();
  const ref = useRef<HTMLDivElement>(null);

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("tab-index", String(index));
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const pin = () => update(tab.id, { pinned: !tab.pinned });
  const toggle = () => update(tab.id, { collapsed: !tab.collapsed });
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
      draggable={draggable}
      onDragStart={draggable ? onDragStart : undefined}
      onDrop={draggable ? onDrop : undefined}
      onDragOver={draggable ? (e) => e.preventDefault() : undefined}
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
    </div>
  );
}
