"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useParams } from "next/navigation";

interface Almacen {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export default function AlmacenDetallePage() {
  const params = useParams();
  const id = params.id as string;
  const [almacen, setAlmacen] = useState<Almacen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/almacenes/${id}`)
      .then(jsonOrNull)
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAlmacen(data.almacen);
      })
      .catch(() => setError("Error al cargar almacén"))
      .finally(() => setLoading(false));
  }, [id]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (loading) return <div className="p-4">Cargando...</div>;
  if (!almacen) return <div className="p-4">No encontrado</div>;

  return (
    <div data-oid="almacen-detalle">
      <h1 className="text-2xl font-bold mb-2">{almacen.nombre}</h1>
      {almacen.descripcion && <p className="text-sm text-[var(--dashboard-muted)]">{almacen.descripcion}</p>}
    </div>
  );
}
