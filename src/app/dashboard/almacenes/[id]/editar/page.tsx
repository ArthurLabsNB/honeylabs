"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import { useParams, useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import Spinner from "@/components/Spinner";

export default function EditarAlmacenPage() {
  const { id } = useParams();
  const router = useRouter();
  const toast = useToast();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenUrl, setImagenUrl] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/almacenes/${id}`)
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
      let body: FormData | string;
      let headers: Record<string, string> | undefined;
      if (imagen) {
        const form = new FormData();
        form.append('nombre', nombre);
        form.append('descripcion', descripcion);
        form.append('imagen', imagen);
        form.append('prevImagenUrl', imagenUrl);
        body = form;
      } else {
        body = JSON.stringify({ nombre, descripcion, imagenUrl });
        headers = { 'Content-Type': 'application/json' };
      }
      const res = await apiFetch(`/api/almacenes/${id}`, {
        method: 'PUT',
        body,
        headers,
      });
      const data = await jsonOrNull(res);
      if (res.ok) {
        toast.show("Almacén actualizado", "success");
        router.push(`/dashboard/almacenes/${id}`);
      } else {
        toast.show(data.error || "Error al actualizar", "error");
      }
    } catch {
      toast.show("Error de red", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="p-4" data-oid="ri8i4m1">
        <Spinner />
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
          type="file"
          accept="image/*"
          className="border p-2 rounded w-full"
          onChange={(e) => setImagen(e.target.files?.[0] || null)}
        />
        {(imagen || imagenUrl) && (
          <div className="mt-2 flex items-start gap-2">
            <img
              src={imagen ? URL.createObjectURL(imagen) : imagenUrl}
              alt="preview"
              className="w-24 h-24 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => {
                setImagen(null);
                setImagenUrl('');
              }}
              className="px-2 py-1 bg-red-600 text-white text-xs rounded"
            >
              Quitar
            </button>
          </div>
        )}

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
