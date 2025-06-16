"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/Spinner";
import useAuditorias from "@/hooks/useAuditorias";

export default function AuditoriasPage() {
  const router = useRouter();
  const [tipo, setTipo] = useState("todos");
  const [categoria, setCategoria] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const { auditorias, loading } = useAuditorias({ tipo, categoria, q: busqueda });

  const filtradas = auditorias.filter((a) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      a.observaciones?.toLowerCase().includes(q) ||
      a.almacen?.nombre?.toLowerCase().includes(q) ||
      a.material?.nombre?.toLowerCase().includes(q) ||
      a.unidad?.nombre?.toLowerCase().includes(q) ||
      a.usuario?.nombre?.toLowerCase().includes(q)
    );
  });

  if (loading)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Auditorías</h1>
        <button onClick={() => router.back()} className="underline text-sm">
          Volver
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        <input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar"
          className="dashboard-input flex-1"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="dashboard-input"
        >
          <option value="todos">Todos</option>
          <option value="almacen">Almacenes</option>
          <option value="material">Materiales</option>
          <option value="unidad">Unidades</option>
        </select>
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="dashboard-input"
        >
          <option value="todas">Todas</option>
          <option value="entrada">Entradas</option>
          <option value="salida">Salidas</option>
          <option value="modificacion">Modificaciones</option>
          <option value="eliminacion">Eliminaciones</option>
          <option value="creacion">Creaciones</option>
          <option value="exportacion">Exportaciones</option>
          <option value="importacion">Importaciones</option>
          <option value="actualizacion">Actualizaciones</option>
          <option value="duplicacion">Duplicaciones</option>
        </select>
      </div>
      <ul className="space-y-2">
        {filtradas.map((a) => (
          <li key={a.id} className="dashboard-card space-y-1">
            <div className="flex justify-between items-center">
              <span className="font-semibold">
                {a.almacen?.nombre || a.material?.nombre || a.unidad?.nombre}
              </span>
              <span className="text-xs">
                {new Date(a.fecha).toLocaleString()}
              </span>
            </div>
            <div className="text-xs">
              <span className="font-semibold mr-2">{a.categoria || a.tipo}</span>
              {a.observaciones && <span className="mr-2">{a.observaciones}</span>}
              {a.usuario?.nombre && <span className="mr-2">{a.usuario.nombre}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
