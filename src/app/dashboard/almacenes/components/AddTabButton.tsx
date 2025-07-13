"use client";
import { Plus } from "lucide-react";
import { useTabStore } from "@/hooks/useTabs";
import { generarUUID } from "@/lib/uuid";

export default function AddTabButton() {
  const { addAfterActive } = useTabStore();
  const create = () => {
    addAfterActive({ id: generarUUID(), title: "Nueva tarjeta", type: "blank", side: "left" });
  };
  return (
    <button
      onClick={create}
      title="Añadir tarjeta"
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 w-12 h-12 rounded-full bg-[var(--dashboard-accent)] text-black flex items-center justify-center shadow-lg hover:scale-105 transition"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
}
