"use client";

export default function PizarraSidebar() {
  return (
    <aside
      className="w-48 p-2 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] flex flex-col gap-2"
      data-oid="y:gglal"
    >
      <button
        className="p-2 hover:bg-white/10 rounded"
        title="Herramienta de selección"
        data-oid="d7eink8"
      >
        🔧
      </button>
      <button
        className="p-2 hover:bg-white/10 rounded"
        title="Añadir nota"
        data-oid="288c37u"
      >
        📝
      </button>
      <button
        className="p-2 hover:bg-white/10 rounded"
        title="Agregar forma"
        data-oid="33l0syn"
      >
        ◻️
      </button>
    </aside>
  );
}
