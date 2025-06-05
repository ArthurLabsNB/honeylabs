"use client";

export default function PizarraSidebar() {
  return (
    <aside
      className="w-48 p-2 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] flex flex-col gap-2"
      data-oid="d61-170"
    >
      <button
        className="p-2 hover:bg-white/10 rounded"
        title="Herramienta de selección"
        data-oid="n2i0eof"
      >
        🔧
      </button>
      <button
        className="p-2 hover:bg-white/10 rounded"
        title="Añadir nota"
        data-oid=".5myoyj"
      >
        📝
      </button>
      <button
        className="p-2 hover:bg-white/10 rounded"
        title="Agregar forma"
        data-oid="z7p2i2e"
      >
        ◻️
      </button>
    </aside>
  );
}
