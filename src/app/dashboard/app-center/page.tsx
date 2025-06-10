"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import type { Usuario } from "@/types/usuario";
import useSession from "@/hooks/useSession";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";
import Spinner from "@/components/Spinner";

interface AppInfo {
  id: number;
  nombre: string;
}

export default function AppCenterPage() {
  const allowed = ["admin", "administrador", "institucional", "empresarial"];
  const { usuario, loading: loadingUsuario } = useSession();
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadingUsuario) return;
    if (!usuario) {
      setError("Debes iniciar sesión");
      return;
    }
    const rol = getMainRole(usuario)?.toLowerCase();
    const tipo = normalizeTipoCuenta(usuario.tipoCuenta);
    if (rol !== "admin" && rol !== "administrador" && !allowed.includes(tipo)) {
      setError("No autorizado");
      return;
    }
    setError("");
  }, [usuario, loadingUsuario]);

  useEffect(() => {
    if (loadingUsuario || !usuario || error) return;
    setLoading(true);
    apiFetch("/api/app-center")
      .then(jsonOrNull)
      .then((d) => setApps(d.apps || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario, loadingUsuario, error]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="jwq_wwn">
        {error}
      </div>
    );

  if (loading || loadingUsuario)
    return (
      <div className="p-4" data-oid="c1ns:-c">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4" data-oid="u15atho">
      <h1 className="text-2xl font-bold mb-4" data-oid="gu0yin4">
        App Center
      </h1>
      <ul className="list-disc pl-4" data-oid="way:fh4">
        {apps.map((a) => (
          <li key={a.id} data-oid="mscc:n-">
            {a.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
