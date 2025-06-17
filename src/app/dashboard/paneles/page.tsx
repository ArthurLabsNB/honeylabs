"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Grid as GridIcon, List as ListIcon } from "lucide-react";
import useSession from "@/hooks/useSession";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import Spinner from "@/components/Spinner";

interface Panel {
  id: string;
  nombre: string;
  fechaMod?: string;
}

export default function PanelesPage() {
  const { usuario, loading } = useSession();
  const [paneles, setPaneles] = useState<Panel[]>([]);
  const [nuevo, setNuevo] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"todos" | "creados" | "conectados">("todos");

  const cargar = () => {
    apiFetch("/api/paneles")
      .then(jsonOrNull)
      .then((d) => setPaneles(d.paneles || []));
  };

  useEffect(() => {
    if (usuario) cargar();
  }, [usuario]);

  const crear = async () => {
    if (!nuevo.trim()) return;
    await apiFetch("/api/paneles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevo }),
    });
    setNuevo("");
    cargar();
  };

  if (loading) return <Spinner />;

  const panelesFiltrados = paneles.filter((p) =>
    filter === "todos" ? true : filter === "creados" ? !p.conectado : !!p.conectado,
  );

  return (
    <div className="p-4 space-y-8">
      {/* Sección de plantillas */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <div
          onClick={crear}
          className="dashboard-card flex flex-col items-center justify-center h-32 cursor-pointer"
        >
          <Plus className="w-8 h-8" />
          <span className="mt-2 text-sm">Nueva pizarra</span>
        </div>
        {[
          "Kanban",
          "Mapa mental",
          "Diagrama de flujo",
          "Retrospectiva",
        ].map((t) => (
          <div key={t} className="dashboard-card flex items-center justify-center h-32">
            {t}
          </div>
        ))}
      </div>

      {/* Filtros y controles */}
      <div className="flex items-center justify-between">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="dashboard-input px-2 py-1 text-sm"
        >
          <option value="todos">Todas</option>
          <option value="creados">Creadas</option>
          <option value="conectados">Conectadas</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded ${
              view === "grid" ? "bg-[var(--dashboard-accent)] text-black" : "bg-white/10"
            }`}
            title="Vista cuadriculada"
            aria-label="Vista cuadriculada"
          >
            <GridIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded ${
              view === "list" ? "bg-[var(--dashboard-accent)] text-black" : "bg-white/10"
            }`}
            title="Vista de lista"
            aria-label="Vista de lista"
          >
            <ListIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Historial */}
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {panelesFiltrados.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/paneles/${p.id}`}
              className="dashboard-card h-24 flex flex-col justify-between"
            >
              <span className="font-semibold">{p.nombre}</span>
              {p.fechaMod && (
                <span className="text-xs text-gray-400">
                  {new Date(p.fechaMod).toLocaleDateString()}
                </span>
              )}
            </Link>
          ))}
          {!panelesFiltrados.length && (
            <div className="text-sm text-gray-400">No hay pizarras</div>
          )}
        </div>
      ) : (
        <ul className="space-y-2">
          {panelesFiltrados.map((p) => (
            <li key={p.id} className="dashboard-card flex justify-between items-center">
              <Link href={`/dashboard/paneles/${p.id}`}>{p.nombre}</Link>
              {p.fechaMod && (
                <span className="text-xs text-gray-400">
                  {new Date(p.fechaMod).toLocaleDateString()}
                </span>
              )}
            </li>
          ))}
          {!panelesFiltrados.length && (
            <li className="text-sm text-gray-400">No hay pizarras</li>
          )}
        </ul>
      )}
    </div>
  );
}
