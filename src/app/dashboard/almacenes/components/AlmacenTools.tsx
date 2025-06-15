"use client";
import { Menu, Settings, Download, FileText, Lock, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

export default function AlmacenTools({ id }: { id: string | number }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-md hover:bg-white/10"
      >
        <Menu className="w-5 h-5" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md bg-[var(--dashboard-sidebar)] border border-[var(--dashboard-border)] shadow-lg z-50">
          <Link
            href={`/dashboard/almacenes/${id}/editar`}
            className="block px-3 py-2 text-sm hover:bg-white/5"
          >
            <Settings className="w-4 h-4 inline mr-2" /> Configuración
          </Link>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/5" onClick={() => window.open(`/api/reportes?id=${id}`, '_blank')}>
            <FileText className="w-4 h-4 inline mr-2" /> Generar reporte
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/5" onClick={() => window.dispatchEvent(new Event('gestionar-permisos'))}>
            <Lock className="w-4 h-4 inline mr-2" /> Gestionar permisos
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/5" onClick={() => window.dispatchEvent(new Event('sincronizar-almacen'))}>
            <RefreshCcw className="w-4 h-4 inline mr-2" /> Sincronizar
          </button>
          <button className="w-full text-left px-3 py-2 text-sm hover:bg-white/5">
            <Download className="w-4 h-4 inline mr-2" /> Exportar
          </button>
        </div>
      )}
    </div>
  );
}
