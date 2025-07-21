"use client";
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/components/Toast";
import { tabOptions } from "./tabOptions";
import { useCreateTab } from "@/hooks/useCreateTab";
import type { TabType } from "@/hooks/useTabs";

export default function AddCardButton() {
  const toast = useToast();
  const { create: createHook, disabled } = useCreateTab({
    // Altura base suficiente para la mayoría de formularios
    defaultLayout: { w: 1, h: 3 },
  });
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
    await createHook(type, label)
    setOpen(false)
  }
  return (
    <div
      ref={ref}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40"
    >
      <button
        onClick={() => {
          if (disabled) {
            toast.show("Crea una pestaña primero", "error");
            return;
          }
          setOpen((v) => !v);
        }}
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
