"use client";
import { useState } from "react";
import { busquedaSemantica } from "@/lib/search/semantic";

const datos = ["Almacen Principal", "Usuario Invitado", "Bodega Central"];

export default function BusquedaPage() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<string[]>([]);

  const buscar = () => setRes(busquedaSemantica(q, datos));

  return (
    <div className="p-4 space-y-4" data-oid="busqueda-root">
      <h1 className="text-2xl font-bold">Búsqueda Semántica</h1>
      <input
        className="dashboard-input w-full"
        placeholder="Buscar"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      <button className="dashboard-button" onClick={buscar}>
        Buscar
      </button>
      <ul className="list-disc pl-4">
        {res.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  );
}
