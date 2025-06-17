"use client";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import useSession from "@/hooks/useSession";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import { usePanelOps } from "../PanelOpsContext";

export default function PanelDetailNavbar({ onShowHistory }: { onShowHistory?: () => void }) {
  const { usuario } = useSession();
  const plan = usuario?.plan?.nombre || "Free";
  const params = useParams();
  const panelId = Array.isArray(params?.id) ? params.id[0] : (params as any)?.id;
  const [nombre, setNombre] = useState("");
  const [edit, setEdit] = useState(false);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [openExport, setOpenExport] = useState(false);
  const { guardar } = usePanelOps();

  useEffect(() => {
    const close = () => setOpenExport(false);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    if (!panelId) return;
    apiFetch(`/api/paneles/${panelId}`)
      .then(jsonOrNull)
      .then((d) => setNombre(d.panel?.nombre || "Sin título"))
      .catch(() => {});
  }, [panelId]);

  const guardarNombre = async () => {
    if (!panelId) return;
    setSaving("saving");
    await apiFetch(`/api/paneles/${panelId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    setSaving("saved");
    setTimeout(() => setSaving("idle"), 2000);
  };

  const exportar = async (formato: string) => {
    if (!panelId) return;
    if (formato === "json") {
      const res = await apiFetch(`/api/paneles/${panelId}`);
      const data = await jsonOrNull(res);
      if (!data?.panel) return;
      const blob = new Blob([
        JSON.stringify(data.panel, null, 2),
      ], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pizarra_${panelId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      alert(`Exportar ${formato} no implementado`);
    }
  };

  return (
    <header
      className="flex items-center justify-between h-[3.5rem] min-h-[3.5rem] px-4 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)] fixed left-0 right-0 z-30"
    >
      <div className="flex items-center gap-3">
        <Link href="/dashboard/paneles" className="p-2 text-gray-400 hover:bg-white/10 rounded-lg" title="Volver">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Image src="/logo-honeylabs.png" alt="HoneyLabs" width={20} height={20} />
        {edit ? (
          <input
            className="bg-transparent border-b outline-none text-sm"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onBlur={() => {
              setEdit(false);
              guardarNombre();
            }}
            autoFocus
          />
        ) : (
          <span className="font-semibold text-sm cursor-text" onClick={() => setEdit(true)}>
            {nombre}
          </span>
        )}
        <span className="absolute left-0 -bottom-4 text-xs text-gray-400">{plan}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            guardar();
            guardarNombre();
          }}
          className="px-3 py-1 rounded bg-white/10 text-sm"
        >
          Guardar
        </button>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpenExport((o) => !o)}
            className="px-3 py-1 rounded bg-white/10 text-sm flex items-center gap-1"
          >
            <Download className="w-4 h-4" /> Exportar
          </button>
          {openExport && (
            <div className="absolute right-0 mt-2 bg-[var(--dashboard-navbar)] border border-[var(--dashboard-border)] rounded shadow-md z-10">
              {['pdf','png','svg','json'].map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    exportar(f);
                    setOpenExport(false);
                  }}
                  className="block px-3 py-1 text-sm text-left hover:bg-white/10 w-full"
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={onShowHistory} className="px-3 py-1 rounded bg-white/10 text-sm">
          Historial
        </button>
        {saving === "saving" && <span className="text-xs text-gray-400">Guardando...</span>}
        {saving === "saved" && <span className="text-xs text-green-500">Guardado</span>}
      </div>
    </header>
  );
}
