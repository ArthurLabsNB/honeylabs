"use client";
import { Plus, Upload, Download, Link2, Search, LayoutList, LayoutGrid, Star } from "lucide-react";
import { useAlmacenesUI } from "../ui";
import { useEffect, useState } from "react";

interface Usuario {
  tipoCuenta?: string;
  rol?: string;
}

export default function AlmacenesNavbar() {
  const { view, setView, filter, setFilter, onCreate } = useAlmacenesUI();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    fetch('/api/login', { credentials: 'include' })
      .then(r => r.json())
      .then(d => d.success ? setUsuario(d.usuario) : setUsuario(null))
      .catch(() => setUsuario(null));
  }, []);

  const allowManage = usuario?.rol === 'admin' || usuario?.tipoCuenta === 'institucional' || usuario?.tipoCuenta === 'empresarial';

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
        <button onClick={() => setFilter('todos')} className={`p-2 rounded hover:bg-white/10 ${filter==='todos'?'text-[var(--dashboard-accent)]':''}`} title="Todos">
          <span>Todos</span>
        </button>
        <button onClick={() => setFilter('favoritos')} className={`p-2 rounded hover:bg-white/10 ${filter==='favoritos'?'text-[var(--dashboard-accent)]':''}`} title="Favoritos">
          <Star className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        {allowManage && (
          <button onClick={() => {
            const nombre = prompt('Nombre del almacén');
            if (!nombre) return;
            const descripcion = prompt('Descripción') || '';
            onCreate?.(nombre, descripcion);
          }} className="p-2 hover:bg-white/10 rounded" title="Crear">
            <Plus className="w-5 h-5" />
          </button>
        )}
        {allowManage && (
          <button onClick={() => alert('Importar')} className="p-2 hover:bg-white/10 rounded" title="Importar">
            <Upload className="w-5 h-5" />
          </button>
        )}
        {allowManage && (
          <button onClick={() => alert('Exportar')} className="p-2 hover:bg-white/10 rounded" title="Exportar">
            <Download className="w-5 h-5" />
          </button>
        )}
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
