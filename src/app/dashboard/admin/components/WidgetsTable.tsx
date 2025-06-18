"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import type { WidgetMeta } from "@lib/widgets";
import Spinner from "@/components/Spinner";

const PLANS = ["Free", "Pro", "Empresarial", "Institucional"];
const TYPES = ["individual", "empresarial", "institucional", "codigo", "admin"];

export default function WidgetsTable() {
  const [widgets, setWidgets] = useState<WidgetMeta[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiFetch("/api/admin/widgets")
      .then(jsonOrNull)
      .then((d) => setWidgets(d.widgets || []))
      .catch(() => setError("Error cargando widgets"));
  }, []);

  const toggle = (key: string, value: string, type: "plan" | "tipo") => {
    setWidgets((ws) =>
      ws.map((w) => {
        if (w.key !== key) return w;
        const list = (type === "plan" ? w.plans : w.tipos) || [];
        const exists = list.includes(value);
        const updated = exists ? list.filter((p) => p !== value) : [...list, value];
        if (type === "plan") w.plans = updated; else w.tipos = updated;
        return { ...w };
      })
    );
    setSaving(true);
    const widget = widgets.find((w) => w.key === key);
    apiFetch("/api/admin/widgets", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, plans: widget?.plans, tipos: widget?.tipos }),
    })
      .catch(() => setError("Error guardando"))
      .finally(() => setSaving(false));
  };

  if (error) return <div className="text-red-500">{error}</div>;
  if (!widgets.length) return <div><Spinner /></div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Widgets</h2>
      {saving && <span className="text-sm text-gray-500">Guardando...</span>}
      <table className="min-w-full text-sm">
        <thead>
          <tr>
            <th className="text-left">Widget</th>
            {PLANS.map((p) => (
              <th key={p}>{p}</th>
            ))}
            {TYPES.map((t) => (
              <th key={t}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {widgets.map((w) => (
            <tr key={w.key}>
              <td className="pr-2 font-semibold">{w.title}</td>
              {PLANS.map((p) => (
                <td key={p} className="text-center">
                  <input
                    type="checkbox"
                    checked={w.plans?.includes(p) ?? false}
                    onChange={() => toggle(w.key, p, "plan")}
                  />
                </td>
              ))}
              {TYPES.map((t) => (
                <td key={t} className="text-center">
                  <input
                    type="checkbox"
                    checked={w.tipos?.includes(t) ?? false}
                    onChange={() => toggle(w.key, t, "tipo")}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
