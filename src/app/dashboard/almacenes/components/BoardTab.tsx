"use client";
import { Pencil, Copy, X } from "lucide-react";
import { useBoardStore, type Board } from "@/hooks/useBoards";
import { usePrompt } from "@/hooks/usePrompt";

export default function BoardTab({ tab }: { tab: Board }) {
  const { activeId, setActive, rename, remove, duplicate } = useBoardStore();
  const prompt = usePrompt();

  const onRename = async () => {
    const name = await prompt("Renombrar pestaña", tab.title);
    if (name) rename(tab.id, name);
  };

  const onDuplicate = () => duplicate(tab.id);
  const onRemove = () => remove(tab.id);

  return (
    <div
      onClick={() => setActive(tab.id)}
      className={`px-3 py-1 rounded-md cursor-pointer select-none flex items-center gap-1 text-sm whitespace-nowrap transition-colors ${
        activeId === tab.id
          ? "bg-[var(--dashboard-accent)] text-black"
          : "bg-[var(--dashboard-sidebar)] text-white hover:bg-white/10"
      }`}
    >
      <span className="px-1">{tab.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRename();
        }}
        className="p-1 hover:bg-white/20 rounded"
        title="Renombrar"
      >
        <Pencil className="w-3 h-3" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        className="p-1 hover:bg-white/20 rounded"
        title="Duplicar"
      >
        <Copy className="w-3 h-3" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-1 hover:bg-white/20 rounded"
        title="Eliminar"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

