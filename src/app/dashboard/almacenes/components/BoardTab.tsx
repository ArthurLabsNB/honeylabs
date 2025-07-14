"use client";
import { useRef } from "react";
import { Pencil, Copy, X } from "lucide-react";
import { useBoardStore, type Board } from "@/hooks/useBoards";
import { usePrompt } from "@/hooks/usePrompt";

export default function BoardTab({ tab, index }: { tab: Board; index: number }) {
  const { activeId, setActive, move, rename, remove, duplicate } = useBoardStore();
  const prompt = usePrompt();
  const ref = useRef<HTMLDivElement>(null);

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("board-index", String(index));
  };
  const onDrop = (e: React.DragEvent) => {
    const from = Number(e.dataTransfer.getData("board-index"));
    move(from, index);
  };

  const onRename = async () => {
    const name = await prompt("Renombrar pestaña", tab.title);
    if (name) rename(tab.id, name);
  };

  const onDuplicate = () => duplicate(tab.id);
  const onRemove = () => remove(tab.id);

  return (
    <div
      ref={ref}
      draggable
      onDragStart={onDragStart}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => setActive(tab.id)}
      className={`px-2 py-0.5 rounded cursor-pointer select-none flex items-center gap-1 text-sm whitespace-nowrap ${
        activeId === tab.id ? "bg-[var(--dashboard-accent)] text-black" : "bg-[var(--dashboard-sidebar)] text-white"
      }`}
    >
      <span className="px-1">{tab.title}</span>
      <button onClick={onRename} className="p-1 hover:bg-white/20 rounded" title="Renombrar">
        <Pencil className="w-3 h-3" />
      </button>
      <button onClick={onDuplicate} className="p-1 hover:bg-white/20 rounded" title="Duplicar">
        <Copy className="w-3 h-3" />
      </button>
      <button onClick={onRemove} className="p-1 hover:bg-white/20 rounded" title="Eliminar">
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

