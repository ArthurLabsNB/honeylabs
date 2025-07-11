"use client";
import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { useTabStore, type TabType } from "@/hooks/useTabs";
import { generarUUID } from "@/lib/uuid";

const options: Array<{ type: TabType; label: string }> = [
  { type: "materiales", label: "Materiales" },
  { type: "form-material", label: "Formulario Material" },
  { type: "unidades", label: "Unidades" },
  { type: "form-unidad", label: "Formulario Unidad" },
  { type: "auditorias", label: "Auditorías" },
];

export default function TabsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { add } = useTabStore();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const create = (type: TabType, label: string) => {
    add({ id: generarUUID(), title: label, type });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="p-2 hover:bg-white/10 rounded-lg"
        title="Agregar tarjeta"
      >
        <Plus className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-[var(--dashboard-sidebar)] border border-[var(--dashboard-border)] shadow-lg z-50 text-sm">
          {options.map(opt => (
            <button
              key={opt.type}
              onClick={() => create(opt.type, opt.label)}
              className="block w-full text-left px-3 py-2 hover:bg-white/5"
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
