"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import type { Usuario } from "@/types/usuario";
import useSession from "@/hooks/useSession";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";

interface Reporte {
  id: number;
  titulo: string;
}

export default function ReportesPage() {
  const allowed = ["admin", "administrador", "institucional", "empresarial"];
  const { usuario, loading: loadingUsuario } = useSession();
  const [reportes, setReportes] = useState<Reporte[]>([]);
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
    fetch("/api/reportes")
      .then(jsonOrNull)
      .then((d) => setReportes(d.reportes || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario, loadingUsuario, error]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid=":csr4hq">
        {error}
      </div>
    );

  if (loading || loadingUsuario)
    return (
      <div className="p-4" data-oid="8l4d8tc">
        Cargando...
      </div>
    );

  return (
    <div className="p-4" data-oid="vevh11y">
      <h1 className="text-2xl font-bold mb-4" data-oid="0w60ab2">
        Reportes
      </h1>
      <ul className="list-disc pl-4" data-oid="cjii6yp">
        {reportes.map((r) => (
          <li key={r.id} data-oid="dxe_-je">
            {r.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
}
