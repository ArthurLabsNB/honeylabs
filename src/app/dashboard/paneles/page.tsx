"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import useSession from "@/hooks/useSession";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import Spinner from "@/components/Spinner";

interface Panel {
  id: string;
  nombre: string;
  fechaMod?: string;
}

export default function PanelesPage() {
  const { usuario, loading } = useSession();
  const [paneles, setPaneles] = useState<Panel[]>([]);
  const [nuevo, setNuevo] = useState("");

  const cargar = () => {
    apiFetch("/api/paneles")
      .then(jsonOrNull)
      .then((d) => setPaneles(d.paneles || []));
  };

  useEffect(() => {
    if (usuario) cargar();
  }, [usuario]);

  const crear = async () => {
    if (!nuevo.trim()) return;
    await apiFetch("/api/paneles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nuevo }),
    });
    setNuevo("");
    cargar();
  };

  if (loading) return <Spinner />;

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <input
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          placeholder="Nuevo panel"
          className="px-2 py-1 rounded bg-white/5"
        />
        <button
          onClick={crear}
          className="px-3 py-1 rounded bg-[var(--dashboard-accent)] text-black text-sm"
        >
          Crear
        </button>
      </div>
      <ul className="space-y-2">
        {paneles.map((p) => (
          <li key={p.id} className="border-b border-white/10 pb-2">
            <Link href={`/dashboard/paneles/${p.id}`} className="text-[var(--dashboard-accent)]">
              {p.nombre}
            </Link>
            {p.fechaMod && (
              <span className="ml-2 text-xs text-gray-400">{new Date(p.fechaMod).toLocaleDateString()}</span>
            )}
          </li>
        ))}
        {!paneles.length && <li className="text-sm text-gray-400">No hay paneles</li>}
      </ul>
    </div>
  );
}
