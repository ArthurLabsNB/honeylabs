"use client";
import { useEffect, useState } from "react";

const pasos = ["Inicio", "Proceso", "Fin"];

export default function FlujoPage() {
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndice((v) => (v + 1) % pasos.length);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="p-4 space-y-4" data-oid="flujo-root">
      <h1 className="text-2xl font-bold">Simulación de Flujo</h1>
      <div className="dashboard-card p-6 text-center text-lg">{pasos[indice]}</div>
    </div>
  );
}
