"use client";
import { useEffect, useState } from "react";
import type { Juego } from "./PanelMinijuegos";

interface Props {
  onPlay: (juego: Juego) => void;
}

export default function ListaJuegos({ onPlay }: Props) {
  const [juegos, setJuegos] = useState<Juego[]>([]);

  useEffect(() => {
    fetch("/api/minijuegos")
      .then((r) => r.json())
      .then((d) => setJuegos(d.juegos || []));
  }, []);

  async function eliminar(id: number) {
    const res = await fetch(`/api/minijuegos/${id}`, { method: "DELETE" });
    if (res.ok) setJuegos((j) => j.filter((x) => x.id !== id));
  }

  return (
    <div className="space-y-2">
      {juegos.map((j) => (
        <div key={j.id} className="flex gap-2 items-center">
          <span className="flex-1">{j.nombre} ({j.plataforma})</span>
          <button className="px-2 bg-miel text-[#22223b] rounded" onClick={() => onPlay(j)}>
            Jugar
          </button>
          <button className="px-2 bg-red-500 text-white rounded" onClick={() => eliminar(j.id)}>
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
