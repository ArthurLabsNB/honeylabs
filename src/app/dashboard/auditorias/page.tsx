"use client";
import { useState } from "react";
import Spinner from "@/components/Spinner";
import useAuditorias from "@/hooks/useAuditorias";

export default function AuditoriasPage() {
  const [tipo, setTipo] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const { auditorias, loading } = useAuditorias({ tipo });

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
      <h1 className="text-2xl font-bold">Auditorías</h1>
      <div className="flex gap-2">
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
              {a.tipo}
              {a.categoria && <span className="ml-2">{a.categoria}</span>}
              {a.observaciones && <span className="ml-2">{a.observaciones}</span>}
              {a.usuario?.nombre && <span className="ml-2">{a.usuario.nombre}</span>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
