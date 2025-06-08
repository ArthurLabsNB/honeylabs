"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useParams, useRouter } from "next/navigation";

export default function EditarAlmacenPage() {
  const { id } = useParams();
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/almacenes/${id}`)
      .then(jsonOrNull)
      .then((d) => {
        if (d.almacen) {
          setNombre(d.almacen.nombre);
          setDescripcion(d.almacen.descripcion || "");
          setImagenUrl(d.almacen.imagenUrl || "");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const guardar = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/almacenes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion, imagenUrl }),
      });
      const data = await jsonOrNull(res);
      if (res.ok) {
        router.push(`/dashboard/almacenes/${id}`);
      } else {
        alert(data.error || "Error al actualizar");
      }
    } catch {
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-4" data-oid="ri8i4m1">
        Cargando...
      </div>
    );

  return (
    <div className="p-4 max-w-md w-full mx-auto" data-oid="h1_23wn">
      <h1 className="text-xl font-bold mb-4" data-oid="biq1l0t">
        Editar almacén
      </h1>
      <div className="flex flex-col gap-2" data-oid="iev4qc_">
        <input
          className="border p-2 rounded w-full"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          data-oid="w5nxozo"
        />

        <textarea
          className="border p-2 rounded w-full"
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          data-oid="usl33-1"
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Imagen (URL)"
          value={imagenUrl}
          onChange={(e) => setImagenUrl(e.target.value)}
        />

        <button
          onClick={guardar}
          className="p-2 bg-[var(--dashboard-accent)] text-white rounded w-full"
          data-oid="ovyyjp4"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}
