"use client";

/*****************************************************************************************
 * WidgetsTable.tsx – Gestión de accesos por plan / tipo                                  *
 * --------------------------------------------------------------------------------------*
 * Dependencias externas eliminadas → sin ‘immer’, ‘shadcn/ui’, ni ‘sonner’.              *
 * • SWR + optimistic update (manual, sin immer)                                          *
 * • Debounce de 400 ms con use‑debounce                                                  *
 * • Spinner global mientras carga                                                       *
 * • Tabla responsive, header sticky, zebra & hover                                       *
 *****************************************************************************************/

import { useCallback } from "react";
import useSWR from "swr";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import type { WidgetMeta } from "@lib/widgets";
import Spinner from "@/components/Spinner";
import { useDebouncedCallback } from "use-debounce";

const PLANS = ["Free", "Pro", "Empresarial", "Institucional"] as const;
const TYPES = ["individual", "empresarial", "institucional", "codigo", "admin"] as const;

const fetcher = (url: string) => apiFetch(url).then(jsonOrNull);

export default function WidgetsTable() {
  const { data, error, isLoading, mutate } = useSWR<{ widgets: WidgetMeta[] }>(
    "/api/admin/widgets",
    fetcher,
    { revalidateOnFocus: false }
  );

  const debouncedSave = useDebouncedCallback(
    (payload: Partial<WidgetMeta> & { key: string }) => {
      apiFetch("/api/admin/widgets", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },
    400
  );

  const toggle = useCallback(
    (key: string, value: string, field: "plans" | "tipos") => {
      if (!data) return;
      const next = { ...data };
      next.widgets = data.widgets.map((w) => {
        if (w.key !== key) return w;
        const list = [...(w[field] || [])] as string[];
        w = { ...w };
        if (list.includes(value)) {
          w[field] = list.filter((v) => v !== value) as any;
        } else {
          w[field] = [...list, value] as any;
        }
        return w;
      });

      mutate(next, false); // optimistic
      debouncedSave({
        key,
        [field]: next.widgets.find((w) => w.key === key)?.[field],
      });
    },
    [data, mutate, debouncedSave]
  );

  if (isLoading)
    return (
      <div className="flex h-32 items-center justify-center">
        <Spinner />
      </div>
    );

  if (error || !data) return <p className="text-red-500">Error al cargar widgets.</p>;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold">Widgets</h2>
      <div className="overflow-x-auto rounded-lg border border-zinc-700">
        <table className="min-w-full text-sm">
          <thead className="sticky top-0 z-10 bg-zinc-800/60 backdrop-blur">
            <tr>
              <th className="py-2 px-3 text-left font-medium">Widget</th>
              {PLANS.map((p) => (
                <th key={p} className="px-3 font-medium capitalize">
                  {p}
                </th>
              ))}
              {TYPES.map((t) => (
                <th key={t} className="px-3 font-medium capitalize">
                  {t}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {data.widgets.map((w) => (
              <tr key={w.key} className="hover:bg-zinc-800/30">
                <td className="whitespace-nowrap py-2 px-3 font-semibold">
                  {w.title}
                </td>
                {PLANS.map((p) => (
                  <td key={p} className="text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-amber-400 focus:ring-amber-400"
                      checked={w.plans?.includes(p) ?? false}
                      onChange={() => toggle(w.key, p, "plans")}
                    />
                  </td>
                ))}
                {TYPES.map((t) => (
                  <td key={t} className="text-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-amber-400 focus:ring-amber-400"
                      checked={w.tipos?.includes(t) ?? false}
                      onChange={() => toggle(w.key, t, "tipos")}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
