"use client";
import { useState } from "react";
import { optimizarDiagrama, Diagrama } from "@/lib/visualAI";

const inicial: Diagrama = {
  nodos: [
    { id: "c", x: 50, y: 20 },
    { id: "a", x: 10, y: 10 },
    { id: "b", x: 30, y: 40 },
  ],
};

export default function IAVisualPage() {
  const [diag, setDiag] = useState(inicial);

  return (
    <div className="p-4 space-y-4" data-oid="ia-visual-root">
      <h1 className="text-2xl font-bold">IA Visual</h1>
      <pre className="bg-white/10 p-3 rounded text-xs whitespace-pre-wrap">
        {JSON.stringify(diag, null, 2)}
      </pre>
      <button
        className="dashboard-button"
        onClick={() => setDiag(optimizarDiagrama(diag))}
      >
        Optimizar
      </button>
    </div>
  );
}
