"use client";
import { useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useRouter } from "next/navigation";

export default function NuevoAlmacenPage() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const crear = async () => {
    if (!nombre.trim()) return alert("Nombre requerido");
    setLoading(true);
    try {
      const res = await fetch("/api/almacenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion }),
      });
      const data = await jsonOrNull(res);
      if (res.ok) {
        router.push(`/dashboard/almacenes/${data.almacen.id}`);
      } else {
        alert(data.error || "Error al crear");
      }
    } catch {
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md w-full mx-auto" data-oid="j:6i7_3">
      <h1 className="text-xl font-bold mb-4" data-oid="i6x6r3s">
        Crear almacén
      </h1>
      <div className="flex flex-col gap-2" data-oid="rl1j4nn">
        <input
          className="border p-2 rounded w-full"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          data-oid="er6:8k."
        />

        <textarea
          className="border p-2 rounded w-full"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          data-oid="cbiio_3"
        />

        <button
          onClick={crear}
          disabled={loading}
          className="p-2 bg-[var(--dashboard-accent)] text-white rounded w-full"
          data-oid="25i.t7k"
        >
          {loading ? "Creando..." : "Crear"}
        </button>
      </div>
    </div>
  );
}
