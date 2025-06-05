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
  Filter,
  SlidersHorizontal,
  Settings as Cog,
  Info,
  UserPlus,
} from "lucide-react";
import { useAlmacenesUI } from "../ui";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";

interface Usuario {
  tipoCuenta?: string;
  rol?: string;
}

export default function AlmacenesNavbar() {
  const { view, setView, filter, setFilter, onCreate } = useAlmacenesUI();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    fetch('/api/login', { credentials: 'include' })
      .then(jsonOrNull)
      .then(d => d.success ? setUsuario(d.usuario) : setUsuario(null))
      .catch(() => setUsuario(null));
  }, []);

  // Permisos de gestión
  const allowManage = usuario?.rol === 'admin' || usuario?.tipoCuenta === 'institucional' || usuario?.tipoCuenta === 'empresarial';

  return (
    <header className="flex items-center justify-between p-2 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]" style={{ minHeight: '50px' }}>
      {/* ------ CONTENIDO IZQUIERDO: contexto y vistas ------ */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">Almacenes</span>
        {/* Switch de vistas */}
        <button onClick={() => setView('list')} className={`p-2 rounded hover:bg-white/10 ${view === 'list' ? 'text-[var(--dashboard-accent)] font-bold' : ''}`} title="Lista">
          <LayoutList className="w-5 h-5" />
        </button>
        <button onClick={() => setView('grid')} className={`p-2 rounded hover:bg-white/10 ${view === 'grid' ? 'text-[var(--dashboard-accent)] font-bold' : ''}`} title="Cuadrícula">
          <LayoutGrid className="w-5 h-5" />
        </button>
        <button onClick={() => setView('tree')} className={`p-2 rounded hover:bg-white/10 ${view === 'tree' ? 'text-[var(--dashboard-accent)] font-bold' : ''}`} title="Árbol">
          <ListTree className="w-5 h-5" />
        </button>
        {/* Filtros rápidos */}
        <button onClick={() => setFilter('todos')} className={`p-2 rounded hover:bg-white/10 ${filter === 'todos' ? 'text-[var(--dashboard-accent)] font-bold' : ''}`} title="Todos">
          Todos
        </button>
        <button onClick={() => setFilter('favoritos')} className={`p-2 rounded hover:bg-white/10 ${filter === 'favoritos' ? 'text-[var(--dashboard-accent)] font-bold' : ''}`} title="Favoritos">
          <Star className="w-4 h-4" />
        </button>
        {/* Filtros avanzados (abre modal o panel lateral) */}
        <button onClick={() => alert('Filtros avanzados')} className="p-2 rounded hover:bg-white/10" title="Filtros avanzados">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* ------ CONTENIDO DERECHO: acciones rápidas y búsqueda ------ */}
      <div className="flex items-center gap-2">
        {/* Crear almacén */}
        {allowManage && (
          <button onClick={() => {
            const nombre = prompt('Nombre del almacén');
            if (!nombre) return;
            const descripcion = prompt('Descripción') || '';
            onCreate?.(nombre, descripcion);
          }} className="p-2 hover:bg-white/10 rounded" title="Crear almacén">
            <Plus className="w-5 h-5" />
          </button>
        )}
        {/* Conectar por código */}
        <button onClick={() => alert('Conectar por código')} className="p-2 hover:bg-white/10 rounded" title="Conectar por código">
          <Link2 className="w-5 h-5" />
        </button>
        {/* Invitar a colaborador (diferente a compartir y a gestión de usuarios del sidebar) */}
        <button onClick={() => alert('Invitar colaborador')} className="p-2 hover:bg-white/10 rounded" title="Invitar colaborador">
          <UserPlus className="w-5 h-5" />
        </button>
        {/* Importar/exportar (solo para managers) */}
        {allowManage && (
          <>
            <button onClick={() => alert('Importar almacenes')} className="p-2 hover:bg-white/10 rounded" title="Importar almacenes">
              <Upload className="w-5 h-5" />
            </button>
            <button onClick={() => alert('Exportar almacenes')} className="p-2 hover:bg-white/10 rounded" title="Exportar almacenes">
              <Download className="w-5 h-5" />
            </button>
          </>
        )}
        {/* Buscador */}
        <div className="relative ml-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--dashboard-muted)] pointer-events-none" />
          <input
            className="dashboard-input pl-8 pr-3 py-1.5"
            placeholder="Buscar almacén..."
          />
        </div>
        {/* Historial solo para visualizar eventos globales */}
        <button onClick={() => alert('Historial de actividad')} className="p-2 hover:bg-white/10 rounded" title="Historial">
          <Clock className="w-5 h-5" />
        </button>
        {/* Información de ayuda (no configuración ni ajustes profundos) */}
        <button onClick={() => window.location.href = '/ayuda'} className="p-2 hover:bg-white/10 rounded" title="Ayuda / Guía">
          <Info className="w-5 h-5" />
        </button>
        {/* Ajustes rápidos de visualización (no avanzados) */}
        <button onClick={() => alert('Opciones de visualización')} className="p-2 hover:bg-white/10 rounded" title="Opciones de visualización">
          <Cog className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
