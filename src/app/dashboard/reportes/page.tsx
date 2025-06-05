"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";

interface Usuario {
  rol?: string;
  tipoCuenta?: string;
}
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
    fetch("/api/reportes")
      .then(jsonOrNull)
      .then((d) => setReportes(d.reportes || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="dxr1dy0">
        {error}
      </div>
    );
  if (loading)
    return (
      <div className="p-4" data-oid="wt64p7n">
        Cargando...
      </div>
    );

  return (
    <div className="p-4" data-oid="reportes-page">
      <h1 className="text-2xl font-bold mb-4" data-oid="uy7-pvc">
        Reportes
      </h1>
      <ul className="list-disc pl-4" data-oid="0vkug.c">
        {reportes.map((r) => (
          <li key={r.id} data-oid="hqi2v_f">
            {r.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
}
