"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { Plus, Grid as GridIcon, List as ListIcon } from "lucide-react";
import { FixedSizeList as VList } from "react-window";
import useSession from "@/hooks/useSession";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import Spinner from "@/components/Spinner";
import { usePrompt } from "@/hooks/usePrompt";

interface Panel {
  id: string;
  nombre: string;
  fechaMod?: string;
}

export default function PanelesPage() {
  const { usuario, loading } = useSession();
  const prompt = usePrompt();
  const t = useTranslations();
  const [paneles, setPaneles] = useState<Panel[]>([]);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"todos" | "creados" | "conectados">("todos");
  const [search, setSearch] = useState('');

  const cargar = () => {
    apiFetch("/api/paneles")
      .then(jsonOrNull)
      .then((d) => setPaneles(d.paneles || []));
  };

  useEffect(() => {
    if (usuario) cargar();
  }, [usuario]);

  useEffect(() => {
    if (!usuario) return;
    const id = setInterval(cargar, 5000);
    return () => clearInterval(id);
  }, [usuario]);

  const crear = async () => {
    const nombre = await prompt("Nombre de la pizarra");
    if (!nombre) return;
    await apiFetch("/api/paneles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    cargar();
  };

  if (loading) return <Spinner />;

  const panelesFiltrados = paneles.filter((p) =>
    (filter === "todos" ? true : filter === "creados" ? !p.conectado : !!p.conectado) &&
    p.nombre.toLowerCase().includes(search.toLowerCase())
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
          <span className="mt-2 text-sm">{t('newBoard')}</span>
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
        <div className="flex gap-2 items-center">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="dashboard-input px-2 py-1 text-sm"
          >
            <option value="todos">Todas</option>
            <option value="creados">Creadas</option>
            <option value="conectados">Conectadas</option>
          </select>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('searchPlaceholder')}
            aria-label="Buscar pizarra"
            className="dashboard-input px-2 py-1 text-sm"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView("grid")}
            className={`p-2 rounded ${
              view === "grid" ? "bg-[var(--dashboard-accent)] text-black" : "bg-white/10"
            }`}
            title={t('gridView')}
            aria-label={t('gridView')}
          >
            <GridIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded ${
              view === "list" ? "bg-[var(--dashboard-accent)] text-black" : "bg-white/10"
            }`}
            title={t('listView')}
            aria-label={t('listView')}
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
            <div className="text-sm text-gray-400">{t('noBoards')}</div>
          )}
        </div>
      ) : (
        <div>
          {panelesFiltrados.length ? (
            <VList
              height={Math.min(400, panelesFiltrados.length * 64)}
              itemCount={panelesFiltrados.length}
              itemSize={64}
              width="100%"
            >
              {({ index, style }) => {
                const p = panelesFiltrados[index]
                return (
                  <div style={style} className="dashboard-card flex justify-between items-center px-2">
                    <Link href={`/dashboard/paneles/${p.id}`}>{p.nombre}</Link>
                    {p.fechaMod && (
                      <span className="text-xs text-gray-400">
                        {new Date(p.fechaMod).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                )
              }}
            </VList>
          ) : (
            <div className="text-sm text-gray-400">{t('noBoards')}</div>
          )}
        </div>
      )}
    </div>
  );
}
