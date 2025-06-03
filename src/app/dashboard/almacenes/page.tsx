"use client";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    fetch(`/api/almacenes?usuarioId=${usuario.id}`)
      .then((res) => res.json())
      .then((data) => setAlmacenes(data.almacenes || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (loading) return <div className="p-4">Cargando...</div>;

  return (
    <div className="p-4" data-oid="almacenes-page">
      <h1 className="text-2xl font-bold mb-4">Almacenes</h1>
      <ul className="list-disc pl-4">
        {almacenes.map((a) => (
          <li key={a.id}>{a.nombre}</li>
        ))}
      </ul>
    </div>
  );
}
