"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import useSession from "@/hooks/useSession";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";
import Spinner from "@/components/Spinner";
import UsuariosTable from "./components/UsuariosTable";
import WidgetsTable from "./components/WidgetsTable";

interface Stats {
  usuarios: number;
  almacenes: number;
}

export default function AdminPage() {
  const allowed = ["admin", "administrador"];
  const { usuario, loading: loadingUsuario } = useSession();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadingUsuario) return;
    if (!usuario) { setError("Debes iniciar sesión"); return; }
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
    apiFetch("/api/admin")
      .then(jsonOrNull)
      .then((d) => setStats(d.stats || null))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario, loadingUsuario, error]);

  if (error)
    return <div className="p-4 text-red-500">{error}</div>;

  if (loading || loadingUsuario)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );

  if (!stats) return null;

  return (
    <div className="p-4 space-y-8">
      <section>
        <h1 className="text-2xl font-bold mb-4">Administración</h1>
        <ul className="list-disc pl-4">
          <li>Usuarios: {stats.usuarios}</li>
          <li>Almacenes: {stats.almacenes}</li>
        </ul>
      </section>
      <UsuariosTable />
      <WidgetsTable />
    </div>
  );
}
