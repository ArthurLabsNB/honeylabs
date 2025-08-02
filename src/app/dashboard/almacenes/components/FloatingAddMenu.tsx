"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { Plus, QrCode, FileUp, Copy } from "lucide-react";
import useOutsideClick from "@/hooks/useOutsideClick";

export default function FloatingAddMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);
  useOutsideClick(ref, close);

  return (
    <div ref={ref} className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-12 h-12 rounded-full bg-[var(--dashboard-accent)] text-white flex items-center justify-center shadow-lg hover:scale-105 transition"
        aria-label="Abrir menú"
      >
        <Plus className="w-6 h-6" />
      </button>
      {open && (
        <div className="absolute bottom-14 right-0 mb-2 w-48 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-lg">
          <MenuLink href="/dashboard/almacenes/nuevo" icon={<Plus className="w-4 h-4" />} label="Agregar Almacén" />
          <MenuLink href="/dashboard/almacenes/scan" icon={<QrCode className="w-4 h-4" />} label="Escanear Código QR" />
          <MenuLink href="/dashboard/almacenes/archivos" icon={<FileUp className="w-4 h-4" />} label="Importar desde archivo" />
          <MenuLink href="/dashboard/almacenes/duplicar" icon={<Copy className="w-4 h-4" />} label="Duplicar Almacén" />
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-amber-50 dark:hover:bg-zinc-700 rounded-md"
    >
      {icon}
      {label}
    </Link>
  );
}
