"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import useSession from "@/hooks/useSession";
import Spinner from "@/components/Spinner";

interface AppInfo {
  version: string;
  url: string;
}

export default function AppPage() {
  const { usuario, loading: loadingUsuario } = useSession();
  const [info, setInfo] = useState<AppInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loadingUsuario) return;
    if (!usuario) {
      setError("Debes iniciar sesión");
      return;
    }
    setError("");
  }, [usuario, loadingUsuario]);

  useEffect(() => {
    if (loadingUsuario || !usuario || error) return;
    setLoading(true);
    apiFetch("/api/app")
      .then(jsonOrNull)
      .then((d) => setInfo(d))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario, loadingUsuario, error]);

  if (error)
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );

  if (loading || loadingUsuario)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );

  if (!info) return <div className="p-4">No disponible</div>;

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">App</h1>
      <p>
        Versión actual: <span className="font-mono">{info.version}</span>
      </p>
      <a
        href={info.url}
        className="inline-block px-4 py-2 bg-[var(--dashboard-accent)] text-black rounded"
      >
        Descargar
      </a>
    </div>
  );
}
