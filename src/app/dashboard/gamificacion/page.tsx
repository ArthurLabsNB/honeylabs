"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@lib/api";

interface Logro {
  id: number;
  nombre: string;
  descripcion: string;
  puntos: number;
}

export default function GamificacionPage() {
  const [logros, setLogros] = useState<Logro[]>([]);
  const [completados, setCompletados] = useState<number[]>([]);

  useEffect(() => {
    apiFetch("/api/gamificacion")
      .then((r) => r.json())
      .then((d) => setLogros(d.logros || []));
    try {
      setCompletados(JSON.parse(localStorage.getItem("logros-completados") || "[]"));
    } catch {
      setCompletados([]);
    }
  }, []);

  const toggle = (id: number) => {
    const list = completados.includes(id)
      ? completados.filter((x) => x !== id)
      : [...completados, id];
    localStorage.setItem("logros-completados", JSON.stringify(list));
    setCompletados(list);
  };

  return (
    <div className="space-y-4" data-oid="gamificacion-root">
      <h1 className="text-2xl font-bold">Gamificación</h1>
      <ul className="space-y-2">
        {logros.map((l) => (
          <li key={l.id} className="flex items-center justify-between p-3 rounded bg-white/10">
            <div>
              <h3 className="font-semibold">{l.nombre}</h3>
              <p className="text-sm opacity-75">{l.descripcion}</p>
            </div>
            <button
              className={`px-3 py-1 rounded text-sm ${completados.includes(l.id) ? "bg-green-600" : "bg-gray-600"}`}
              onClick={() => toggle(l.id)}
            >
              {completados.includes(l.id) ? "Completado" : "Marcar"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
