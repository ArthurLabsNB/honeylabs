"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAlmacenesUI } from "./ui";

interface Usuario {
  id: number;
  rol?: string;
  tipoCuenta?: string;
}

interface Almacen {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export default function AlmacenesPage() {
  const allowed = ["admin", "institucional", "empresarial", "estandar"];
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { view, filter, registerCreate } = useAlmacenesUI();


  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (!data?.success) throw new Error();
        const tipo =
          data.usuario.rol === "admin"
            ? "admin"
            : data.usuario.tipoCuenta ?? "estandar";
        if (!allowed.includes(tipo)) {
          throw new Error("No autorizado");
        }
        setUsuario(data.usuario);
      })
      .catch((err) => {
        setError(err.message || "Debes iniciar sesión");
      });
  }, []);

  const crearAlmacen = async (nombre: string, descripcion: string) => {
    try {
      const res = await fetch('/api/almacenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion })
      });
      const data = await res.json();
      if (res.ok && data.almacen) {
        setAlmacenes((a) => [...a, data.almacen]);
      } else {
        alert(data.error || 'Error al crear');
      }
    } catch {
      alert('Error de red');
    }
  };

  useEffect(() => {
    registerCreate(crearAlmacen);
  }, [registerCreate]);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    const fav = filter === 'favoritos' ? '&favoritos=1' : '';
    fetch(`/api/almacenes?usuarioId=${usuario.id}${fav}`)
      .then((res) => res.json())
      .then((data) => setAlmacenes(data.almacenes || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario, filter]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (loading) return <div className="p-4">Cargando...</div>;

  return (
    <div className="p-4" data-oid="almacenes-page">
      {view === "list" ? (
        <ul className="divide-y">
          {almacenes.map((a) => (
            <li
              key={a.id}
              className="p-2 cursor-pointer hover:bg-white/5"
              onClick={() => router.push(`/dashboard/almacenes/${a.id}`)}
            >
              <h3 className="font-semibold">{a.nombre}</h3>
              {a.descripcion && (
                <p className="text-sm text-[var(--dashboard-muted)]">
                  {a.descripcion}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {almacenes.map((a) => (
            <div
              key={a.id}
              className="p-4 border rounded-lg cursor-pointer hover:bg-white/5"
              onClick={() => router.push(`/dashboard/almacenes/${a.id}`)}
            >
              <h3 className="font-semibold mb-1">{a.nombre}</h3>
              {a.descripcion && (
                <p className="text-sm text-[var(--dashboard-muted)]">
                  {a.descripcion}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
