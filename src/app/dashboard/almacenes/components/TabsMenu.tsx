"use client";
import { useState, useRef, useCallback } from "react";
import { Plus } from "lucide-react";
import { useTabStore } from "@/hooks/useTabs";
import { useToast } from "@/components/Toast";
import { tabOptions } from "./tabOptions";
import { useCreateTab } from "@/hooks/useCreateTab";
import type { TabType } from "@/hooks/useTabs";
import useOutsideClick from "@/hooks/useOutsideClick";

export default function TabsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { closeOthers, activeId } = useTabStore();
  const toast = useToast();
  const { create: createHook, disabled } = useCreateTab();

  const close = useCallback(() => setOpen(false), []);
  useOutsideClick(ref, close);

  const create = async (type: TabType, label: string) => {
    await createHook(type, label)
    setOpen(false)
  }
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
