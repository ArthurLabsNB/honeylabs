"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";

type FormState = {
  nombre: string;
  descripcion: string;
  funciones: string;
  permisos: string;          // se envía como permisosPredeterminados
  imagen: File | null;
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // ⬅️ igual que el servidor
const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
]);

export default function NuevoAlmacenPage() {
  const [form, dispatch] = useReducer(
    (s: FormState, a: Partial<FormState>) => ({ ...s, ...a }),
    { nombre: "", descripcion: "", funciones: "", permisos: "", imagen: null },
  );
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false); // ⬅️ evita doble submit
  const router = useRouter();
  const toast = useToast();

  // Preview seguro (sin pérdidas de memoria)
  const previewUrl = useMemo(() => {
    if (!form.imagen) return null;
    return URL.createObjectURL(form.imagen);
  }, [form.imagen]);
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  async function crear(e?: React.FormEvent) {
    e?.preventDefault();
    if (submittingRef.current || loading) return;

    const nombre = form.nombre.trim();
    const descripcion = form.descripcion.trim();
    const funciones = form.funciones.trim();
    const permisosPredeterminados = form.permisos.trim();

    if (!nombre) {
      toast.show("Nombre requerido", "error");
      return;
    }

    if (form.imagen) {
      if (!ALLOWED_TYPES.has(form.imagen.type)) {
        toast.show("Formato de imagen no permitido", "error");
        return;
      }
      if (form.imagen.size > MAX_IMAGE_BYTES) {
        toast.show("Imagen demasiado grande (máx. 5MB)", "error");
        return;
      }
    }

    setLoading(true);
    submittingRef.current = true;
    try {
      const fd = new FormData();
      fd.append("nombre", nombre);
      fd.append("descripcion", descripcion);
      if (funciones) fd.append("funciones", funciones);
      if (permisosPredeterminados)
        fd.append("permisosPredeterminados", permisosPredeterminados);
      if (form.imagen) fd.append("imagen", form.imagen);

      const res = await apiFetch("/api/almacenes", { method: "POST", body: fd });
      const data = await jsonOrNull(res);

      if (!res.ok) {
        toast.show(data?.error || "Error al crear", "error");
        return;
      }

      // Soporta varias formas de respuesta
      const newId =
        data?.almacen?.id ??
        data?.data?.id ??
        data?.id ??
        null;

      toast.show("Almacén creado", "success");
      if (newId) {
        router.push(`/dashboard/almacenes/${newId}`);
      } else {
        // Fallback: regresar al listado
        router.push("/dashboard/almacenes");
      }
      router.refresh();
    } catch {
      toast.show("Error de red", "error");
    } finally {
      setLoading(false);
      submittingRef.current = false;
    }
  }

  return (
    <div className="p-4 max-w-lg w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Crear almacén</h1>

      <form onSubmit={crear} className="flex flex-col gap-3">
        <input
          className="border border-white/10 bg-white/5 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/60"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => dispatch({ nombre: e.target.value })}
          required
        />

        <textarea
          className="border border-white/10 bg-white/5 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/60"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => dispatch({ descripcion: e.target.value })}
          rows={3}
        />

        <textarea
          className="border border-white/10 bg-white/5 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/60"
          placeholder="Funciones (opcional)"
          value={form.funciones}
          onChange={(e) => dispatch({ funciones: e.target.value })}
          rows={2}
        />

        <input
          className="border border-white/10 bg-white/5 rounded px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500/60"
          placeholder="Permisos predeterminados (JSON opcional)"
          value={form.permisos}
          onChange={(e) => dispatch({ permisos: e.target.value })}
        />

        <div className="space-y-2">
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded file:border-0 file:bg-amber-500 file:text-white hover:file:bg-amber-600"
            onChange={(e) => dispatch({ imagen: e.target.files?.[0] || null })}
          />
          {previewUrl && (
            <div className="mt-1 flex items-start gap-2">
              <img
                src={previewUrl}
                alt="preview"
                className="w-24 h-24 object-cover rounded border border-white/10"
              />
              <button
                type="button"
                onClick={() => dispatch({ imagen: null })}
                className="px-2 py-1 bg-red-600 text-white text-xs rounded"
              >
                Quitar
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded w-full text-white transition
            ${loading ? "bg-amber-500/60 cursor-not-allowed" : "bg-amber-600 hover:bg-amber-700"}`}
        >
          {loading ? "Generando..." : "Generar almacén"}
        </button>
      </form>
    </div>
  );
}
