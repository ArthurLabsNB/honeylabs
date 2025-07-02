"use client";
import { useEffect, useRef, useState, MouseEvent } from "react";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import { API_APP, API_APP_URL, API_BUILD_MOBILE } from "@lib/apiPaths";
import useSession from "@/hooks/useSession";
import Spinner from "@/components/Spinner";
import { AppInfo } from "@/types/app";
import { useQuery, useMutation } from "@tanstack/react-query";
import useBuildProgress from "@/hooks/useBuildProgress";
import { useToast } from "@/components/Toast";

async function startBuild() {
  const res = await apiFetch(API_BUILD_MOBILE, { method: "POST" });
  if (!res.ok) throw new Error("start_failed");
}

export default function AppPage() {
  const { usuario, loading: loadingUsuario } = useSession();
  const controllerRef = useRef<AbortController>();
  const [prevBuilding, setPrevBuilding] = useState(false);
  const toast = useToast();

  const { data: info, isLoading, isError, refetch } = useQuery({
    queryKey: ["app"],
    queryFn: async () => {
      const controller = new AbortController();
      controllerRef.current = controller;
      const res = await apiFetch(API_APP, { signal: controller.signal });
      if (!res.ok) throw new Error("fetch_error");
      return (await jsonOrNull(res)) as AppInfo;
    },
    refetchInterval: 60_000,
    onSettled: () => {
      controllerRef.current?.abort();
    },
  });

  const buildMutation = useMutation({
    mutationFn: startBuild,
    onSuccess: () => {
      refetch();
    },
    onError: () => toast.show("No se pudo iniciar el build", "error"),
  });

  const handleDownload = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (!info) return;
    e.preventDefault();
    try {
      const res = await apiFetch(API_APP_URL);
      const data = res.ok ? await jsonOrNull(res) : null;
      window.location.href = data?.url || info.url;
    } catch {
      toast.show("Enlace no disponible", "error");
    }
  };

  useEffect(() => {
    if (loadingUsuario) return;
    if (!usuario) toast.show("Debes iniciar sesión", "error");
    else {
      refetch();
    }
  }, [loadingUsuario, usuario, refetch]);

  useEffect(() => {
    if (isError) toast.show("No se pudo obtener la información de la app", "error");
  }, [isError]);

  useEffect(() => {
    if (prevBuilding && info && !info.building) {
      toast.show("APK listo", "success");
    }
    setPrevBuilding(Boolean(info?.building));
  }, [info, prevBuilding, toast]);

  useBuildProgress(Boolean(info?.building));


  if (isLoading || loadingUsuario)
    return (
      <div className="p-4" aria-busy="true" aria-live="polite">
        <Spinner />
      </div>
    );

  if (!info) return <div className="p-4">No disponible</div>;

  if (info.building)
    return (
      <div className="p-4 space-y-4" aria-busy="true" aria-live="polite">
        <h1 className="text-2xl font-bold">App</h1>
        <p>Generando APK... {Math.round(info.progress * 100)}%</p>
        <Spinner />
      </div>
    );

  return (
    <div className="p-4 space-y-4" aria-busy={isLoading || info?.building} aria-live="polite">
      <h1 className="text-2xl font-bold">App</h1>
      <p>
        Versión actual: <span className="font-mono">{info.version}</span>
      </p>
      <p className="break-all font-mono text-sm">SHA-256: {info.sha256}</p>
      <a
        href={info.url}
        download
        onClick={handleDownload}
        className="inline-block px-4 py-2 bg-accent-500 text-black rounded"
      >
        Descargar
      </a>
      {usuario?.tipoCuenta === "admin" && (
        <button
          type="button"
          onClick={() => buildMutation.mutate()}
          disabled={info?.building || buildMutation.isLoading}
          className="ml-4 px-4 py-2 bg-accent-500 rounded hover:brightness-110 disabled:opacity-70"
        >
          {buildMutation.isLoading ? (
            <span className="flex items-center gap-2">
              <span>En curso…</span>
              <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            </span>
          ) : (
            "Generar nueva versión"
          )}
        </button>
      )}
    </div>
  );
}
