"use client";
import { useEffect, useState } from "react";

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
      .then((res) => res.json())
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
    fetch("/api/reportes")
      .then((r) => r.json())
      .then((d) => setReportes(d.reportes || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario]);

  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (loading) return <div className="p-4">Cargando...</div>;

  return (
    <div className="p-4" data-oid="reportes-page">
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>
      <ul className="list-disc pl-4">
        {reportes.map((r) => (
          <li key={r.id}>{r.titulo}</li>
        ))}
      </ul>
    </div>
  );
}
