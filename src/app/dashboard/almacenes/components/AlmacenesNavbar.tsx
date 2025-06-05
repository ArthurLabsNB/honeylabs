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
    fetch("/api/login", { credentials: "include" })
      .then(jsonOrNull)
      .then((d) => (d.success ? setUsuario(d.usuario) : setUsuario(null)))
      .catch(() => setUsuario(null));
  }, []);

  // Permisos de gestión
  const allowManage =
    usuario?.rol === "admin" ||
    usuario?.tipoCuenta === "institucional" ||
    usuario?.tipoCuenta === "empresarial";

  return (
    <header
      className="flex items-center justify-between p-2 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]"
      style={{ minHeight: "50px" }}
      data-oid="44ykd1x"
    >
      {/* ------ CONTENIDO IZQUIERDO: contexto y vistas ------ */}
      <div className="flex items-center gap-2" data-oid="ngyopum">
        <span className="font-semibold text-lg" data-oid="gvzja6p">
          Almacenes
        </span>
        {/* Switch de vistas */}
        <button
          onClick={() => setView("list")}
          className={`p-2 rounded hover:bg-white/10 ${view === "list" ? "text-[var(--dashboard-accent)] font-bold" : ""}`}
          title="Lista"
          data-oid="bivm327"
        >
          <LayoutList className="w-5 h-5" data-oid="xuv4byh" />
        </button>
        <button
          onClick={() => setView("grid")}
          className={`p-2 rounded hover:bg-white/10 ${view === "grid" ? "text-[var(--dashboard-accent)] font-bold" : ""}`}
          title="Cuadrícula"
          data-oid="-hvuy2d"
        >
          <LayoutGrid className="w-5 h-5" data-oid="f5qgwfr" />
        </button>
        <button
          onClick={() => setView("tree")}
          className={`p-2 rounded hover:bg-white/10 ${view === "tree" ? "text-[var(--dashboard-accent)] font-bold" : ""}`}
          title="Árbol"
          data-oid="wc:26us"
        >
          <ListTree className="w-5 h-5" data-oid="59r8bzf" />
        </button>
        {/* Filtros rápidos */}
        <button
          onClick={() => setFilter("todos")}
          className={`p-2 rounded hover:bg-white/10 ${filter === "todos" ? "text-[var(--dashboard-accent)] font-bold" : ""}`}
          title="Todos"
          data-oid="gs-:0t-"
        >
          Todos
        </button>
        <button
          onClick={() => setFilter("favoritos")}
          className={`p-2 rounded hover:bg-white/10 ${filter === "favoritos" ? "text-[var(--dashboard-accent)] font-bold" : ""}`}
          title="Favoritos"
          data-oid="reaq40h"
        >
          <Star className="w-4 h-4" data-oid="m63dvkz" />
        </button>
        {/* Filtros avanzados (abre modal o panel lateral) */}
        <button
          onClick={() => alert("Filtros avanzados")}
          className="p-2 rounded hover:bg-white/10"
          title="Filtros avanzados"
          data-oid="_g9i.7c"
        >
          <SlidersHorizontal className="w-5 h-5" data-oid="57-ern-" />
        </button>
      </div>

      {/* ------ CONTENIDO DERECHO: acciones rápidas y búsqueda ------ */}
      <div className="flex items-center gap-2" data-oid="8u83rya">
        {/* Crear almacén */}
        {allowManage && (
          <button
            onClick={() => {
              const nombre = prompt("Nombre del almacén");
              if (!nombre) return;
              const descripcion = prompt("Descripción") || "";
              onCreate?.(nombre, descripcion);
            }}
            className="p-2 hover:bg-white/10 rounded"
            title="Crear almacén"
            data-oid="qt0j5yy"
          >
            <Plus className="w-5 h-5" data-oid="dn0_aom" />
          </button>
        )}
        {/* Conectar por código */}
        <button
          onClick={() => alert("Conectar por código")}
          className="p-2 hover:bg-white/10 rounded"
          title="Conectar por código"
          data-oid="5dx44qs"
        >
          <Link2 className="w-5 h-5" data-oid="jjzawny" />
        </button>
        {/* Invitar a colaborador (diferente a compartir y a gestión de usuarios del sidebar) */}
        <button
          onClick={() => alert("Invitar colaborador")}
          className="p-2 hover:bg-white/10 rounded"
          title="Invitar colaborador"
          data-oid="ez7cinc"
        >
          <UserPlus className="w-5 h-5" data-oid="7cv3fsq" />
        </button>
        {/* Importar/exportar (solo para managers) */}
        {allowManage && (
          <>
            <button
              onClick={() => alert("Importar almacenes")}
              className="p-2 hover:bg-white/10 rounded"
              title="Importar almacenes"
              data-oid="w_ylxmv"
            >
              <Upload className="w-5 h-5" data-oid="7g_2ovo" />
            </button>
            <button
              onClick={() => alert("Exportar almacenes")}
              className="p-2 hover:bg-white/10 rounded"
              title="Exportar almacenes"
              data-oid="iw2c_n8"
            >
              <Download className="w-5 h-5" data-oid="a3n4xr3" />
            </button>
          </>
        )}
        {/* Buscador */}
        <div className="relative ml-2" data-oid="0k:ww04">
          <Search
            className="w-4 h-4 absolute left-3 top-2.5 text-[var(--dashboard-muted)] pointer-events-none"
            data-oid="lyh_h4w"
          />
          <input
            className="dashboard-input pl-8 pr-3 py-1.5"
            placeholder="Buscar almacén..."
            data-oid="uxx_va8"
          />
        </div>
        {/* Historial solo para visualizar eventos globales */}
        <button
          onClick={() => alert("Historial de actividad")}
          className="p-2 hover:bg-white/10 rounded"
          title="Historial"
          data-oid="3r3i53."
        >
          <Clock className="w-5 h-5" data-oid="a4zzcgy" />
        </button>
        {/* Información de ayuda (no configuración ni ajustes profundos) */}
        <button
          onClick={() => (window.location.href = "/ayuda")}
          className="p-2 hover:bg-white/10 rounded"
          title="Ayuda / Guía"
          data-oid="570416h"
        >
          <Info className="w-5 h-5" data-oid="xofjdl5" />
        </button>
        {/* Ajustes rápidos de visualización (no avanzados) */}
        <button
          onClick={() => alert("Opciones de visualización")}
          className="p-2 hover:bg-white/10 rounded"
          title="Opciones de visualización"
          data-oid="nnz:org"
        >
          <Cog className="w-5 h-5" data-oid="sopqgz9" />
        </button>
      </div>
    </header>
  );
}
