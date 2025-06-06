"use client";
import {
  Plus,
  Search,
  LayoutList,
  LayoutGrid,
  ListTree,
  Star,
  ArrowLeft,
  Menu
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAlmacenesUI } from "../ui";
import type { Usuario } from "@/types/usuario";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { getMainRole, hasManagePerms } from "@lib/permisos";


interface AlmacenNavbarProps {
  mode?: 'list' | 'detail';
  nombre?: string;
}

export default function AlmacenNavbar({ mode = 'list', nombre }: AlmacenNavbarProps) {
  const router = useRouter();
  const { view, setView, filter, setFilter, onCreate } = useAlmacenesUI();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then(jsonOrNull)
      .then((d) => (d?.success ? setUsuario(d.usuario) : setUsuario(null)))
      .catch(() => setUsuario(null));
  }, []);

  // Permisos de gestión
  const allowManage = usuario ? hasManagePerms(usuario) : false;

  if (mode === "detail") {
    return (
      <header className="flex items-center justify-between h-full px-6 w-full">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard/almacenes")}
            className="p-2 rounded-lg text-gray-400 hover:bg-white/10"
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
    <header className="flex items-center justify-between h-full w-full px-4 md:px-6">
      <div className="flex items-center gap-4 md:gap-6">
        <h1 className="text-lg font-semibold text-white">Almacenes</h1>

        <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"}`}
            title="Vista de cuadrícula"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"}`}
            title="Vista de lista"
          >
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("tree")}
            className={`p-2 rounded-md transition-colors ${view === "tree" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"}`}
            title="Vista de árbol"
          >
            <ListTree className="w-4 h-4" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 ml-3">
          <button
            onClick={() => setFilter("todos")}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === "todos" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"}`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter("favoritos")}
            className={`p-2 rounded-md transition-colors ${filter === "favoritos" ? "text-yellow-400 bg-white/5" : "text-gray-400 hover:bg-white/5"}`}
            title="Mostrar solo favoritos"
          >
            <Star className="w-4 h-4" fill={filter === "favoritos" ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="md:hidden relative">
          <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 text-gray-400 hover:bg-white/10 rounded-lg">
            <Menu className="w-5 h-5" />
          </button>
          {menuOpen && (
            <div className="absolute left-0 mt-2 bg-[var(--dashboard-sidebar)] border border-[var(--dashboard-border)] rounded-md p-2 shadow-lg z-50 flex flex-col gap-2">
              <div className="flex gap-1">
                <button onClick={() => setView("grid") && setMenuOpen(false)} className={`p-2 rounded-md transition-colors ${view === "grid" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"}`}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setView("list") && setMenuOpen(false)} className={`p-2 rounded-md transition-colors ${view === "list" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"}`}>
                  <LayoutList className="w-4 h-4" />
                </button>
                <button onClick={() => setView("tree") && setMenuOpen(false)} className={`p-2 rounded-md transition-colors ${view === "tree" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"}`}>
                  <ListTree className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-1">
                <button onClick={() => {setFilter("todos"); setMenuOpen(false);}} className={`px-3 py-1.5 text-sm rounded-md transition-colors ${filter === "todos" ? "bg-white/10 text-white" : "text-gray-400 hover:bg-white/5"}`}>Todos</button>
                <button onClick={() => {setFilter("favoritos"); setMenuOpen(false);}} className={`p-2 rounded-md transition-colors ${filter === "favoritos" ? "text-yellow-400 bg-white/5" : "text-gray-400 hover:bg-white/5"}`}>
                  <Star className="w-4 h-4" fill={filter === "favoritos" ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative w-52 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--dashboard-muted)]" />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="dashboard-input pl-8 pr-2"
            placeholder="Buscar almacén..."
          />
        </div>

        {allowManage && (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (onCreate) onCreate("", "");
            }}
            className="dashboard-btn flex items-center gap-2 h-10 text-base px-4"
          >
            <Plus className="w-4 h-4" />
            <span>Crear almacén</span>
          </button>
        )}
      </div>
    </header>
  );
}
