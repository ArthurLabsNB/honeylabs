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
        className={`relative px-5 py-2 rounded-lg cursor-pointer select-none flex items-center gap-2 text-base whitespace-nowrap transition-colors after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-full after:rounded-b-md after:bg-[var(--dashboard-accent)] after:transition-transform after:duration-300 ${
          activeId === tab.id
            ? "bg-[var(--dashboard-accent)] text-black after:scale-x-100"
            : "bg-[var(--dashboard-sidebar)] text-white hover:bg-[var(--tab-hover-bg)] after:scale-x-0"
        }`}
      style={{ boxShadow: 'var(--tab-shadow)' }}
    >
      <span className="px-1">{tab.title}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRename();
        }}
        className="p-1 rounded hover:bg-[var(--tab-hover-bg)]"
        title="Renombrar"
      >
        <Pencil className="w-3 h-3" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDuplicate();
        }}
        className="p-1 rounded hover:bg-[var(--tab-hover-bg)]"
        title="Duplicar"
      >
        <Copy className="w-3 h-3" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-1 rounded hover:bg-[var(--tab-hover-bg)]"
        title="Eliminar"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}

