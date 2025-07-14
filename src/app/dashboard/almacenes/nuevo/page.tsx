"use client";
import { useReducer, useState } from "react";
import { useToast } from "@/components/Toast";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import { useRouter } from "next/navigation";

export default function NuevoAlmacenPage() {
  interface FormState {
    nombre: string;
    descripcion: string;
    funciones: string;
    permisos: string;
    imagen: File | null;
  }

  const [form, dispatch] = useReducer(
    (s: FormState, a: Partial<FormState>) => ({ ...s, ...a }),
    {
      nombre: "",
      descripcion: "",
      funciones: "",
      permisos: "",
      imagen: null,
    },
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const crear = async () => {
    if (!form.nombre.trim()) return toast.show("Nombre requerido", "error");
    if (form.imagen && form.imagen.size > 2 * 1024 * 1024)
      return toast.show("Imagen demasiado grande", "error");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('nombre', form.nombre);
      fd.append('descripcion', form.descripcion);
      fd.append('funciones', form.funciones);
      fd.append('permisosPredeterminados', form.permisos);
      if (form.imagen) fd.append('imagen', form.imagen);
      const res = await apiFetch('/api/almacenes', { method: 'POST', body: fd });
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
          value={form.nombre}
          onChange={(e) => dispatch({ nombre: e.target.value })}
          data-oid="er6:8k."
        />

        <textarea
          className="border p-2 rounded w-full"
          placeholder="Descripción"
          value={form.descripcion}
          onChange={(e) => dispatch({ descripcion: e.target.value })}
          data-oid="cbiio_3"
        />

        <textarea
          className="border p-2 rounded w-full"
          placeholder="Funciones (opcional)"
          value={form.funciones}
          onChange={(e) => dispatch({ funciones: e.target.value })}
        />

        <input
          className="border p-2 rounded w-full"
          placeholder="Permisos predeterminados"
          value={form.permisos}
          onChange={(e) => dispatch({ permisos: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          className="border p-2 rounded w-full"
          onChange={(e) => dispatch({ imagen: e.target.files?.[0] || null })}
        />
        {form.imagen && (
          <div className="mt-2 flex items-start gap-2">
            <img
              src={URL.createObjectURL(form.imagen)}
              alt="preview"
              className="w-24 h-24 object-cover rounded"
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
