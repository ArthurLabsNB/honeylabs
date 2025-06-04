"use client";
import Link from "next/link";

export default function AlmacenesSidebar() {
  return (
    <aside className="w-48 p-2 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] flex flex-col gap-1">
      <span className="p-2 font-semibold text-sm text-[var(--dashboard-muted)]">Mis almacenes</span>
    </aside>
  );
}
