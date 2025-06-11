"use client";
import { useState } from "react";
import { useToast } from "@/components/Toast";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import { useRouter } from "next/navigation";

export default function NuevoAlmacenPage() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [funciones, setFunciones] = useState("");
  const [permisos, setPermisos] = useState("");
  const [imagen, setImagen] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const crear = async () => {
    if (!nombre.trim()) return toast.show("Nombre requerido", "error");
    setLoading(true);
    try {
      const form = new FormData();
      form.append('nombre', nombre);
      form.append('descripcion', descripcion);
      form.append('funciones', funciones);
      form.append('permisosPredeterminados', permisos);
      if (imagen) form.append('imagen', imagen);
      const res = await apiFetch('/api/almacenes', { method: 'POST', body: form });
      const data = await jsonOrNull(res);
      if (res.ok) {
        toast.show("Almacén creado", "success");
        router.push(`/dashboard/almacenes/${data.almacen.id}`);
      } else {
        toast.show(data.error || "Error al crear", "error");
      }
    } catch {
      toast.show("Error de red", "error");
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

        <textarea
          className="border p-2 rounded w-full"
          placeholder="Funciones (opcional)"
          value={funciones}
          onChange={(e) => setFunciones(e.target.value)}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Permisos predeterminados"
          value={permisos}
          onChange={(e) => setPermisos(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded w-full"
          onChange={(e) => setImagen(e.target.files?.[0] || null)}
        />
        {imagen && (
          <div className="mt-2 flex items-start gap-2">
            <img
              src={URL.createObjectURL(imagen)}
              alt="preview"
              className="w-24 h-24 object-cover rounded"
            />
            <button
              type="button"
              onClick={() => setImagen(null)}
              className="px-2 py-1 bg-red-600 text-white text-xs rounded"
            >
              Quitar
            </button>
          </div>
        )}

        <button
          onClick={crear}
          disabled={loading}
          className="p-2 bg-[var(--dashboard-accent)] text-white rounded w-full"
          data-oid="25i.t7k"
        >
          {loading ? "Generando..." : "Generar almacén"}
        </button>
      </div>
    </div>
  );
}
