"use client";
import { Plus, Upload, Download, Link2, Search, LayoutList, LayoutGrid } from "lucide-react";
import { useAlmacenesUI } from "../ui";

export default function AlmacenesNavbar() {
  const { view, setView } = useAlmacenesUI();
  return (
    <header className="flex items-center justify-between p-2 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]" style={{ minHeight: '50px' }}>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">Almacenes</span>
        <button onClick={() => setView('list')} className={`p-2 rounded hover:bg-white/10 ${view==='list'?'text-[var(--dashboard-accent)]':''}`} title="Lista">
          <LayoutList className="w-5 h-5" />
        </button>
        <button onClick={() => setView('grid')} className={`p-2 rounded hover:bg-white/10 ${view==='grid'?'text-[var(--dashboard-accent)]':''}`} title="Cuadrícula">
          <LayoutGrid className="w-5 h-5" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => alert('Crear almacén')} className="p-2 hover:bg-white/10 rounded" title="Crear">
          <Plus className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Importar')} className="p-2 hover:bg-white/10 rounded" title="Importar">
          <Upload className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Exportar')} className="p-2 hover:bg-white/10 rounded" title="Exportar">
          <Download className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Conectar por código')} className="p-2 hover:bg-white/10 rounded" title="Conectar por código">
          <Link2 className="w-5 h-5" />
        </button>
        <div className="relative ml-2">
          <Search className="w-4 h-4 absolute left-3 top-2 text-[var(--dashboard-muted)]" />
          <input className="pl-8 pr-2 py-1 rounded border border-[var(--dashboard-border)] bg-transparent" placeholder="Buscar" />
        </div>
      </div>
    </header>
  );
}
