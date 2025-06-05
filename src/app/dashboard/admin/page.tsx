"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";

interface Usuario {
  rol?: string;
  tipoCuenta?: string;
}
interface Stats {
  usuarios: number;
  almacenes: number;
}

export default function AdminPage() {
  const allowed = ["admin"];
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then(jsonOrNull)
      .then((data) => {
        if (!data?.success) throw new Error();
        const tipo =
          data.usuario.rol === "admin"
            ? "admin"
            : data.usuario.tipoCuenta ?? "estandar";
        if (!allowed.includes(tipo)) throw new Error("No autorizado");
        setUsuario(data.usuario);
      })
      .catch((err) => setError(err.message || "Debes iniciar sesión"));
  }, []);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    fetch("/api/admin")
      .then(jsonOrNull)
      .then((d) => setStats(d.stats || null))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (loading) return <div className="p-4">Cargando...</div>;
  if (!stats) return null;

  return (
    <div className="p-4" data-oid="admin-page">
      <h1 className="text-2xl font-bold mb-4">Admin</h1>
      <ul className="list-disc pl-4">
        <li>Usuarios: {stats.usuarios}</li>
        <li>Almacenes: {stats.almacenes}</li>
      </ul>
    </div>
  );
}
