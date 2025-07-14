"use client";
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useTabStore, type TabType } from "@/hooks/useTabs";
import { usePrompt } from "@/hooks/usePrompt";
import { generarUUID } from "@/lib/uuid";
import { tabOptions } from "./tabOptions";

export default function AddTabButton() {
  const { addAfterActive } = useTabStore();
  const prompt = usePrompt();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const create = async (type: TabType, label: string) => {
    let url: string | undefined;
    let board: string | undefined;
    if (type === "url") {
      url = await prompt("URL de destino");
      if (!url) return;
    } else if (type === "board") {
      board = await prompt("Tablero destino");
      if (!board) return;
    }
    addAfterActive({
      id: generarUUID(),
      title: label,
      type,
      url,
      board,
      side: "left",
    });
    setOpen(false);
  };

  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40"
    >
      <button
        onClick={() => setOpen((v) => !v)}
        title="Añadir tarjeta"
        className="w-12 h-12 rounded-full bg-[var(--dashboard-accent)] text-black flex items-center justify-center shadow-lg hover:scale-105 transition"
      >
        <Plus className="w-6 h-6" />
      </button>
      {open && (
        <div className="absolute bottom-14 right-0 mb-2 w-40 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg p-1 space-y-1">
          {tabOptions.map(opt => (
            <MenuItem key={opt.type} label={opt.label} onClick={() => create(opt.type, opt.label)} />
          ))}
        </div>
      )}
    </div>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left px-3 py-2 text-sm hover:bg-white/5 rounded-md"
    >
      {label}
    </button>
  );
}
