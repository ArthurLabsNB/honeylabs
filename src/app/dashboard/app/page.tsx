"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import useSession from "@/hooks/useSession";
import Spinner from "@/components/Spinner";

interface AppInfo {
  version: string;
  url: string;
  sha256: string;
  building: boolean;
  progress: number;
}

export default function AppPage() {
  const { usuario, loading: loadingUsuario } = useSession();
  const [info, setInfo] = useState<AppInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const startBuild = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/api/build-mobile", { method: "POST" });
      if (!res.ok) throw new Error();
      setInfo((prev) => (prev ? { ...prev, building: true, progress: 0 } : prev));
    } catch {
      setError("No se pudo iniciar el build");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (!info?.building) return;
    const es = new EventSource("/api/build-mobile/progress");
    es.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        setInfo((prev) => (prev ? { ...prev, ...data } : data));
      } catch {}
    };
    return () => {
      es.close();
    };
  }, [info?.building]);

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

  if (info.building)
    return (
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">App</h1>
        <p>Generando APK... {Math.round(info.progress * 100)}%</p>
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">App</h1>
      <p>
        Versión actual: <span className="font-mono">{info.version}</span>
      </p>
      <p className="break-all font-mono text-sm">SHA-256: {info.sha256}</p>
      <a
        href={info.url}
        download
        className="inline-block px-4 py-2 bg-[var(--dashboard-accent)] text-black rounded"
      >
        Descargar
      </a>
      {usuario?.tipoCuenta === "admin" && (
        <button
          type="button"
          onClick={startBuild}
          className="ml-4 px-4 py-2 bg-amber-500 text-black rounded"
        >
          Generar nueva versión
        </button>
      )}
    </div>
  );
}
