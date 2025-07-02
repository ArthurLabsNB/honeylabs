"use client";
import { useEffect, useRef, MouseEvent } from "react";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import { API_APP, API_BUILD_MOBILE, API_BUILD_PROGRESS } from "@lib/apiPaths";
import useSession from "@/hooks/useSession";
import Spinner from "@/components/Spinner";
import { AppInfo } from "@/types/app";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

async function startBuild() {
  const res = await apiFetch(API_BUILD_MOBILE, { method: "POST" });
  if (!res.ok) throw new Error("start_failed");
}

export default function AppPage() {
  const { usuario, loading: loadingUsuario } = useSession();
  const controllerRef = useRef<AbortController>();
  const qc = useQueryClient();

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
    onError: () => toast.error("No se pudo iniciar el build"),
  });

  const handleDownload = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (!info) return;
    e.preventDefault();
    try {
      const head = await fetch(info.url, { method: "HEAD" });
      let url = info.url;
      if (head.status === 403) {
        const result = await refetch();
        url = result.data?.url || url;
      }
      window.location.href = url;
    } catch {
      toast.error("Enlace no disponible");
    }
  };

  useEffect(() => {
    if (loadingUsuario) return;
    if (!usuario) toast.error("Debes iniciar sesión");
    else {
      toast.dismiss();
      refetch();
    }
  }, [loadingUsuario, usuario, refetch]);

  useEffect(() => {
    if (isError) toast.error("No se pudo obtener la información de la app");
  }, [isError]);

  useEffect(() => {
    if (!info?.building) return;
    let retry = 1;
    let es: EventSource;
    const connect = () => {
      es = new EventSource(API_BUILD_PROGRESS);
      es.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data) as Partial<AppInfo>;
          qc.setQueryData(["app"], (prev: AppInfo | undefined) =>
            prev ? { ...prev, ...data } : undefined,
          );
        } catch {}
      };
      es.onerror = () => {
        es.close();
        setTimeout(connect, retry * 1000);
        retry = Math.min(retry * 2, 30);
      };
    };
    connect();
    return () => {
      es.close();
    };
  }, [info?.building, qc]);


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
        className="inline-block px-4 py-2 bg-[var(--dashboard-accent)] text-black rounded"
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
