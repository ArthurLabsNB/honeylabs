"use client";
import { useEffect } from "react";

export default function QuickInventoryModal({ data, onClose }: { data: { entradas: number; salidas: number; inventario: number }; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inv-title"
    >
      <div
        className="bg-white dark:bg-zinc-800 p-4 rounded-md min-w-[200px]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="inv-title" className="text-lg font-semibold mb-2">Inventario</h2>
        <p>Entradas: {data.entradas}</p>
        <p>Salidas: {data.salidas}</p>
        <p>Total materiales: {data.inventario}</p>
      </div>
    </div>
  );
}
