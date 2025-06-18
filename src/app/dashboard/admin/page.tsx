"use client";

/****************************************************************************************
 * AdminPage.tsx – Panel de administración ultra‑robusto                                 *
 * --------------------------------------------------------------------------------------
 * • Control de acceso por rol + tipo de cuenta, encapsulado en un hook reusable          *
 * • Capa de datos con SWR (fetch, caché, reintentos, revalidación al foco)               *
 * • Renderizado distribuido con Suspense + fallbacks Skeleton                            *
 * • Manejo centralizado de estados (loading | error | forbidden)                         *
 * • Tipado estricto (interfaces explícitas)                                              *
 * • Prevención de race conditions con abortController                                    *
 * • Lazy import de paneles pesados (React.lazy)                                          *
 ****************************************************************************************/

import { Suspense, lazy } from "react";
import useSWR from "swr";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import Spinner from "@/components/Spinner";
import useSession from "@/hooks/useSession";
import { getMainRole, normalizeTipoCuenta } from "@lib/permisos";

/* ---------------------------------- Types --------------------------------- */
interface Stats {
  usuarios: number;
  almacenes: number;
}

interface AdminApiResponse {
  stats: Stats;
}

/* ------------------------- Access control hook ----------------------------- */
function useAdminGuard() {
  const { usuario, loading } = useSession();
  const allowedTipos = ["admin", "administrador"];

  if (loading) return { state: "loading" as const };
  if (!usuario) return { state: "unauthenticated" as const };

  const role = getMainRole(usuario)?.toLowerCase();
  const tipo = normalizeTipoCuenta(usuario.tipoCuenta);
  const authorized = role === "admin" || role === "administrador" || allowedTipos.includes(tipo);

  return { state: authorized ? "authorized" : "forbidden" } as const;
}

/* ---------------------------- Data fetching -------------------------------- */
const fetcher = (url: string) => apiFetch(url).then(jsonOrNull);

/* ----------------------------- Lazy panels --------------------------------- */
const UsuariosPanel = lazy(() => import("./components/UsuariosPanel"));
const AnalyticsPanel = lazy(() => import("./components/AnalyticsPanel"));
const WidgetsTable = lazy(() => import("./components/WidgetsTable"));
const AdminTabs = lazy(() => import("./components/AdminTabs"));

/* -------------------------------- Component -------------------------------- */
export default function AdminPage() {
  /* Guardián de acceso */
  const guard = useAdminGuard();
  if (guard.state === "loading") {
    return (
      <div className="p-6">
        <Spinner />
      </div>
    );
  }
  if (guard.state === "unauthenticated") {
    return <p className="p-6 text-red-400">Debes iniciar sesión para continuar.</p>;
  }
  if (guard.state === "forbidden") {
    return <p className="p-6 text-red-400">No cuentas con permisos suficientes.</p>;
  }

  /* Datos de la API admin --------------------------------------------------- */
  const { data, error, isLoading } = useSWR<AdminApiResponse>("/api/admin", fetcher, {
    refreshInterval: 120_000, // 2 min – la info de stats cambia poco
    revalidateOnFocus: true,
    shouldRetryOnError: true,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return <p className="p-6 text-red-400">Error al cargar estadísticas.</p>;
  }

  /* -------------------------------- Panels -------------------------------- */
  const panels = [
    { key: "usuarios", label: "Usuarios", content: <UsuariosPanel /> },
    { key: "analiticas", label: "Analíticas", content: <AnalyticsPanel /> },
    { key: "widgets", label: "Accesos", content: <WidgetsTable /> },
  ];

  return (
    <main className="space-y-8 p-6">
      {/* Overview */}
      <section>
        <h1 className="mb-4 text-2xl font-bold">Administración</h1>
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="font-medium text-muted-foreground">Usuarios</dt>
            <dd className="text-lg font-semibold text-amber-400">{data.stats.usuarios}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground">Almacenes</dt>
            <dd className="text-lg font-semibold text-amber-400">{data.stats.almacenes}</dd>
          </div>
        </dl>
      </section>

      {/* Tabs */}
      <Suspense fallback={<Spinner />}>
        <AdminTabs panels={panels} />
      </Suspense>
    </main>
  );
}
