"use client";

export default function AlmacenSidebar({
  style,
}: {
  style?: React.CSSProperties;
}) {
  return (
    <aside
      style={style}
      className="w-48 p-2 border-r border-[var(--dashboard-border)] bg-[var(--dashboard-sidebar)] flex flex-col gap-1 fixed"
      data-oid="8b8ue5u"
    >
      <button
        className="p-2 rounded hover:bg-white/10 text-left"
        data-oid="kzvt23y"
      >
        Información
      </button>
      <button
        className="p-2 rounded hover:bg-white/10 text-left"
        data-oid="7mc_6hd"
      >
        Inventario
      </button>
      <button
        className="p-2 rounded hover:bg-white/10 text-left"
        data-oid="o3q2:f3"
      >
        Usuarios
      </button>
    </aside>
  );
}
