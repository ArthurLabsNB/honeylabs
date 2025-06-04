"use client";

export default function PizarraSidebar() {
  return (
    <aside className="w-48 p-2 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] flex flex-col gap-2">
      <button className="p-2 hover:bg-white/10 rounded" title="Herramienta de selección">🔧</button>
      <button className="p-2 hover:bg-white/10 rounded" title="Añadir nota">📝</button>
      <button className="p-2 hover:bg-white/10 rounded" title="Agregar forma">◻️</button>
    </aside>
  );
}
