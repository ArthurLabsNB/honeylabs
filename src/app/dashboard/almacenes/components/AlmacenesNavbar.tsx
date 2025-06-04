"use client";
import {
  Plus,
  Upload,
  Download,
  Link2,
  Search,
  LayoutList,
  LayoutGrid,
  ListTree,
  Star,
  Clock,
  FileBarChart2,
  Share2,
  Copy,
  LifeBuoy,
  Bell,
  CheckSquare,
  BarChart2,
  Settings as Cog,
  Wrench
} from "lucide-react";
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
        <button onClick={() => setView('tree')} className={`p-2 rounded hover:bg-white/10 ${view==='tree'?'text-[var(--dashboard-accent)]':''}`} title="Árbol">
          <ListTree className="w-5 h-5" />
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
        <button onClick={() => alert('Historial de actividad')} className="p-2 hover:bg-white/10 rounded" title="Historial">
          <Clock className="w-5 h-5" />
        </button>
        <button onClick={() => window.location.href='/dashboard/reportes'} className="p-2 hover:bg-white/10 rounded" title="Reportes">
          <FileBarChart2 className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Compartir almacén')} className="p-2 hover:bg-white/10 rounded" title="Compartir">
          <Share2 className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Duplicar almacén')} className="p-2 hover:bg-white/10 rounded" title="Duplicar">
          <Copy className="w-5 h-5" />
        </button>
        <button onClick={() => window.location.href='/ayuda'} className="p-2 hover:bg-white/10 rounded" title="Ayuda">
          <LifeBuoy className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Notificaciones')} className="p-2 hover:bg-white/10 rounded" title="Notificaciones">
          <Bell className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Tareas pendientes')} className="p-2 hover:bg-white/10 rounded" title="Tareas">
          <CheckSquare className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Analíticas')} className="p-2 hover:bg-white/10 rounded" title="Analíticas">
          <BarChart2 className="w-5 h-5" />
        </button>
        <button onClick={() => window.location.href='/configuracion'} className="p-2 hover:bg-white/10 rounded" title="Configuración">
          <Cog className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Plantillas')} className="p-2 hover:bg-white/10 rounded" title="Plantillas">
          <Copy className="w-5 h-5" />
        </button>
        <button onClick={() => alert('Mantenimiento')} className="p-2 hover:bg-white/10 rounded" title="Mantenimiento">
          <Wrench className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
