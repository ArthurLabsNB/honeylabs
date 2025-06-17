"use client";
import { useState } from "react";

export default function ElementosPage() {
  const [valor, setValor] = useState(50);
  const [activo, setActivo] = useState(false);
  const [votos, setVotos] = useState<number[]>([]);

  const votar = (n: number) => {
    setVotos((v) => [...v, n]);
  };

  return (
    <div className="p-4 space-y-4" data-oid="elementos-root">
      <h1 className="text-2xl font-bold">Elementos Avanzados</h1>
      <div>
        <input
          type="range"
          min={0}
          max={100}
          value={valor}
          onChange={(e) => setValor(Number(e.target.value))}
        />
        <span className="ml-2">{valor}</span>
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="sw">Switch</label>
        <input
          id="sw"
          type="checkbox"
          checked={activo}
          onChange={(e) => setActivo(e.target.checked)}
        />
      </div>
      <div className="space-x-2">
        {["👍", "👎"].map((e, i) => (
          <button key={i} onClick={() => votar(i)} className="dashboard-button">
            {e}
          </button>
        ))}
      </div>
      <div className="text-sm">
        Total votos: {votos.length} / Positivos: {votos.filter((v) => v === 0).length}
      </div>
    </div>
  );
}
