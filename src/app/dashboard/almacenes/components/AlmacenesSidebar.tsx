"use client";
import Link from "next/link";

export default function AlmacenesSidebar() {
  return (
    <aside className="w-48 p-2 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] flex flex-col gap-1">
      <Link href="/dashboard/almacenes" className="p-2 rounded hover:bg-white/10">Todos</Link>
      <Link href="/dashboard/almacenes?favoritos=1" className="p-2 rounded hover:bg-white/10">Favoritos</Link>
    </aside>
  );
}
