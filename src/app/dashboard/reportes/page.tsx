"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import type { Usuario } from "@/types/usuario";
import { getMainRole } from "@lib/permisos";

interface Reporte {
  id: number;
  titulo: string;
}

export default function ReportesPage() {
  const allowed = ["admin", "institucional", "empresarial"];
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then(jsonOrNull)
      .then((data) => {
        if (!data?.success) throw new Error();
        const rol = getMainRole(data.usuario)?.toLowerCase();
        const tipo = (data.usuario.tipoCuenta ?? "individual").toLowerCase();
        if (rol !== "admin" && rol !== "administrador" && !allowed.includes(tipo))
          throw new Error("No autorizado");
        setUsuario(data.usuario);
      })
      .catch((err) => setError(err.message || "Debes iniciar sesión"));
  }, []);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    fetch("/api/reportes")
      .then(jsonOrNull)
      .then((d) => setReportes(d.reportes || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid=":csr4hq">
        {error}
      </div>
    );

  if (loading)
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
