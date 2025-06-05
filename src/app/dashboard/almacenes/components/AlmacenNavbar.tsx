"use client";
import { 
  Plus, 
  Search, 
  LayoutList, 
  LayoutGrid, 
  ListTree, 
  Star, 
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAlmacenesUI } from "../ui";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";

interface Usuario {
  tipoCuenta?: string;
  rol?: string;
}

interface AlmacenNavbarProps {
  mode?: 'list' | 'detail';
  nombre?: string;
}

export default function AlmacenNavbar({ mode = 'list', nombre }: AlmacenNavbarProps) {
  const router = useRouter();
  const { view, setView, filter, setFilter, onCreate } = useAlmacenesUI();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then(jsonOrNull)
      .then((d) => (d?.success ? setUsuario(d.usuario) : setUsuario(null)))
      .catch(() => setUsuario(null));
  }, []);

  // Permisos de gestión
  const allowManage =
    usuario?.rol === "admin" ||
    usuario?.tipoCuenta === "institucional" ||
    usuario?.tipoCuenta === "empresarial";

  if (mode === 'detail') {
    return (
      <header className="flex items-center justify-between h-16 px-6 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/almacenes")}
            className="p-2 text-gray-400 hover:bg-white/10 rounded-lg transition-colors"
            title="Volver"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold text-white">
            {nombre || "Almacén"}
          </h1>
        </div>
      </header>
    );
  }

  // Modo lista (default)
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]">
      {/* Contenido izquierdo: Título y controles de vista */}
      <div className="flex items-center gap-6">
        <h1 className="text-lg font-semibold text-white">Almacenes</h1>
        
        <div className="h-6 w-px bg-white/10" />
        
        {/* Selector de vista */}
        <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md transition-colors ${
              view === "grid" 
                ? "bg-white/10 text-white" 
                : "text-gray-400 hover:bg-white/5"
            }`}
            title="Vista de cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md transition-colors ${
              view === "list" 
                ? "bg-white/10 text-white" 
                : "text-gray-400 hover:bg-white/5"
            }`}
            title="Vista de lista"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("tree")}
            className={`p-2 rounded-md transition-colors ${
              view === "tree" 
                ? "bg-white/10 text-white" 
                : "text-gray-400 hover:bg-white/5"
            }`}
            title="Vista de árbol"
          >
            <ListTree className="w-4 h-4" />
          </button>
        </div>

        <div className="h-6 w-px bg-white/10" />

        {/* Filtros */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter("todos")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              filter === "todos" 
                ? "bg-white/10 text-white" 
                : "text-gray-400 hover:bg-white/5"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("favoritos")}
            className={`p-2 rounded-md transition-colors ${
              filter === "favoritos" 
                ? "text-yellow-400 bg-white/5" 
                : "text-gray-400 hover:bg-white/5"
            }`}
            title="Mostrar solo favoritos"
          >
            <Star 
              className="w-4 h-4" 
              fill={filter === "favoritos" ? "currentColor" : "none"} 
            />
          </button>
        </div>
      </div>

      {/* Contenido derecho: Acciones */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => alert("Búsqueda")}
          className="p-2 text-gray-400 hover:bg-white/10 rounded-lg transition-colors"
          title="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>
        
        {allowManage && (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onCreate) onCreate("", "");
            }}
            className="flex items-center gap-2 px-4 h-10 text-sm font-medium bg-[var(--dashboard-accent)] text-white rounded-lg hover:bg-[var(--dashboard-accent-hover)] transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo almacén</span>
          </button>
        )}
      </div>
    </header>
  );
}
