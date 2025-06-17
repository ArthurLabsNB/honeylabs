"use client";
import { useEffect, useState } from "react";

interface Punto {
  x: number;
  y: number;
}

export default function ActividadPage() {
  const [puntos, setPuntos] = useState<Punto[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("actividad")
    if (stored) setPuntos(JSON.parse(stored));
  }, []);

  const registrar = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const p = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    const np = [...puntos, p];
    setPuntos(np);
    localStorage.setItem("actividad", JSON.stringify(np));
  };

  return (
    <div className="p-4 space-y-4" data-oid="actividad-root">
      <h1 className="text-2xl font-bold">Actividad</h1>
      <div
        className="relative w-full h-64 bg-white/10"
        onClick={registrar}
      >
        {puntos.map((p, i) => (
          <span
            key={i}
            className="absolute w-4 h-4 rounded-full bg-red-500/50"
            style={{ left: p.x - 8, top: p.y - 8 }}
          />
        ))}
      </div>
    </div>
  );
}
