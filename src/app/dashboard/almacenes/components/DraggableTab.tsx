"use client";
import { useRef } from "react";
import { useTabStore, Tab } from "@/hooks/useTabs";

export default function DraggableTab({ tab, index }: { tab: Tab; index: number }) {
  const { activeId, setActive, move, update, close } = useTabStore();
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
      className={`px-3 py-1 rounded cursor-pointer select-none flex items-center gap-1 text-sm whitespace-nowrap ${
        activeId === tab.id ? "bg-[var(--dashboard-accent)] text-black" : "bg-[var(--dashboard-sidebar)] text-white"
      }`}
    >
      <span>{tab.title}</span>
      <button onClick={pin} className="text-xs">📌</button>
      {!tab.pinned && (
        <button onClick={() => close(tab.id)} className="text-xs">×</button>
      )}
      <button onClick={minimize} className="text-xs">_</button>
    </div>
  );
}
