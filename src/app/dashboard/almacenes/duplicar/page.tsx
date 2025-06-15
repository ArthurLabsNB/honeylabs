"use client";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import useAlmacenes from "@/hooks/useAlmacenes";

export default function DuplicarAlmacenPage() {
  const { almacenes } = useAlmacenes();
  const toast = useToast();
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const duplicar = async (id: number) => {
    setLoadingId(id);
    try {
      const res = await apiFetch(`/api/almacenes/${id}/duplicar`, { method: "POST" });
      const data = await jsonOrNull(res);
      if (res.ok && data.almacen) {
        toast.show("Almacén duplicado", "success");
        router.push(`/dashboard/almacenes/${data.almacen.id}`);
      } else {
        toast.show(data.error || "Error al duplicar", "error");
      }
    } catch {
      toast.show("Error de red", "error");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-lg mx-auto">
      <h1 className="text-xl font-bold">Duplicar almacén</h1>
      <ul className="space-y-2">
        {almacenes.map((a) => (
          <li key={a.id} className="flex items-center justify-between border px-3 py-2 rounded-md">
            <span>{a.nombre}</span>
            <button
              onClick={() => duplicar(a.id)}
              disabled={loadingId === a.id}
              className="px-2 py-1 text-sm bg-[var(--dashboard-accent)] text-white rounded-md"
            >
              {loadingId === a.id ? "..." : "Duplicar"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
