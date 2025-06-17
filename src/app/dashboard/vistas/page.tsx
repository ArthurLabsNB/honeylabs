"use client";
import { useEffect, useState } from "react";

interface Vista {
  id: string;
  nombre: string;
  datos: string;
}

export default function VistasPage() {
  const [vistas, setVistas] = useState<Vista[]>([]);
  const [nombre, setNombre] = useState("");
  const [actual, setActual] = useState<string>("");

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem("vistas") || "[]");
      setVistas(v);
    } catch {
      setVistas([]);
    }
  }, []);

  const guardar = () => {
    if (!nombre.trim()) return;
    const nv = [...vistas, { id: Date.now().toString(), nombre, datos: actual }];
    localStorage.setItem("vistas", JSON.stringify(nv));
    setVistas(nv);
    setNombre("");
  };

  return (
    <div className="p-4 space-y-4" data-oid="vistas-root">
      <h1 className="text-2xl font-bold">Vistas</h1>
      <input
        className="dashboard-input w-full"
        placeholder="Nombre de la vista"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <textarea
        className="dashboard-input w-full"
        placeholder="Datos"
        value={actual}
        onChange={(e) => setActual(e.target.value)}
        rows={3}
      />
      <button className="dashboard-button" onClick={guardar}>
        Guardar vista
      </button>
      <ul className="list-disc pl-4">
        {vistas.map((v) => (
          <li key={v.id} className="cursor-pointer" onClick={() => setActual(v.datos)}>
            {v.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
