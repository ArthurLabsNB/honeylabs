"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";

interface Usuario {
  rol?: string;
  tipoCuenta?: string;
}
interface AppInfo {
  id: number;
  nombre: string;
}

export default function AppCenterPage() {
  const allowed = ["admin", "institucional", "empresarial"];
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [apps, setApps] = useState<AppInfo[]>([]);
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
            : (data.usuario.tipoCuenta ?? "estandar");
        if (!allowed.includes(tipo)) throw new Error("No autorizado");
        setUsuario(data.usuario);
      })
      .catch((err) => setError(err.message || "Debes iniciar sesión"));
  }, []);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    fetch("/api/app-center")
      .then(jsonOrNull)
      .then((d) => setApps(d.apps || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="m89wg8.">
        {error}
      </div>
    );
  if (loading)
    return (
      <div className="p-4" data-oid="733etta">
        Cargando...
      </div>
    );

  return (
    <div className="p-4" data-oid="appcenter-page">
      <h1 className="text-2xl font-bold mb-4" data-oid="ty_35va">
        App Center
      </h1>
      <ul className="list-disc pl-4" data-oid="-b5pmcc">
        {apps.map((a) => (
          <li key={a.id} data-oid="xj6ocsg">
            {a.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
