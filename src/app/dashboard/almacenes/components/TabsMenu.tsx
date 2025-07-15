"use client";
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useTabStore, type TabType, type Tab } from "@/hooks/useTabs";
import { useBoardStore } from "@/hooks/useBoards";
import { useToast } from "@/components/Toast";
import { generarUUID } from "@/lib/uuid";
import { tabOptions } from "./tabOptions";
import { usePrompt } from "@/hooks/usePrompt";

export default function TabsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { addAfterActive, closeOthers, activeId } = useTabStore();
  const { activeId: boardId, boards } = useBoardStore();
  const toast = useToast();
  const prompt = usePrompt();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const create = async (type: TabType, label: string) => {
    if (!boardId) {
      toast.show("Crea una pestaña primero", "error");
      return;
    }
    const id = generarUUID();
    let title = label;
    const extra: Partial<Tab> = { boardId };
    if (type === "url") {
      const url = await prompt("URL de destino");
      if (!url) return;
      extra.url = url;
      title = url;
    } else if (type === "board") {
      const board = await prompt("Tablero destino");
      if (!board) return;
      extra.boardId = board;
      title = board;
    }
    addAfterActive({ id, title, type, side: "left", ...extra });
    setOpen(false);
  };

  const disabled = !boardId || boards.length === 0;
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          if (disabled) {
            toast.show("Crea una pestaña primero", "error");
            return;
          }
          setOpen(o => !o);
        }}
        className="p-2 hover:bg-white/10 rounded-lg"
        title="Agregar tarjeta"
      >
        <Plus className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-[var(--dashboard-sidebar)] border border-[var(--dashboard-border)] shadow-lg z-50 text-sm">
          {tabOptions.map(opt => (
            <button
              key={opt.type}
              onClick={() => create(opt.type, opt.label)}
              className="block w-full text-left px-3 py-2 hover:bg-white/5"
            >
              {opt.label}
            </button>
          ))}
          <hr className="my-1 border-[var(--dashboard-border)]" />
          {activeId && (
            <button onClick={() => closeOthers(activeId)} className="block w-full text-left px-3 py-2 hover:bg-white/5">Cerrar otras</button>
          )}
        </div>
      )}
    </div>
  );
}
