"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import type { Usuario } from "@/types/usuario";
import useSession from "@/hooks/useSession";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";
import Spinner from "@/components/Spinner";

interface Reporte {
  id: number
  tipo: string
  categoria?: string | null
  observaciones?: string | null
  fecha: string
}

export default function ReportesPage() {
  const allowed = ["admin", "administrador", "institucional", "empresarial"];
  const { usuario, loading: loadingUsuario } = useSession()
  const [reportes, setReportes] = useState<Reporte[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("");
  const [tipo, setTipo] = useState<string>("todos")

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
    if (loadingUsuario || !usuario || error) return
    setLoading(true)
    const q = tipo !== "todos" ? `?tipo=${tipo}` : ""
    apiFetch(`/api/reportes${q}`)
      .then(jsonOrNull)
      .then((d) => setReportes(d.reportes || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false))
  }, [usuario, loadingUsuario, error, tipo])

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid=":csr4hq">
        {error}
      </div>
    );

  if (loading || loadingUsuario)
    return (
      <div className="p-4" data-oid="8l4d8tc">
        <Spinner />
      </div>
    );

  return (
    <div className="p-4" data-oid="vevh11y">
      <h1 className="text-2xl font-bold mb-4" data-oid="0w60ab2">
        Reportes
      </h1>
      <div className="mb-4 flex gap-2">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="dashboard-input"
        >
          <option value="todos">Todos</option>
          <option value="almacen">Almacenes</option>
          <option value="material">Materiales</option>
          <option value="unidad">Unidades</option>
        </select>
      </div>
      <ul className="list-disc pl-4" data-oid="cjii6yp">
        {reportes.map((r) => (
          <li key={r.id} className="mb-2" data-oid="dxe_-je">
            <span className="font-semibold mr-2">{r.tipo}</span>
            <span className="mr-2">{r.categoria}</span>
            <span className="mr-2">{r.observaciones}</span>
            <span className="text-xs text-gray-400 mr-2">
              {new Date(r.fecha).toLocaleString()}
            </span>
            <a
              href={`/api/reportes/${r.id}/export?format=pdf`}
              className="underline mr-1"
            >
              PDF
            </a>
            <a
              href={`/api/reportes/${r.id}/export?format=excel`}
              className="underline mr-1"
            >
              Excel
            </a>
            <a
              href={`/api/reportes/${r.id}/export?format=xml`}
              className="underline"
            >
              XML
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
