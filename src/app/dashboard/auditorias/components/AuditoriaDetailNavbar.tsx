"use client";
import {
  ArrowLeft,
  Download,
  FileText,
  RotateCcw,
  Trash2,
  History,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import { fetchAuditoriaExport } from "@/app/dashboard/utils/auditoriaExport";
import { useToast } from "@/components/Toast";
import { NAVBAR_HEIGHT } from "../../constants";
import { AUDIT_TOGGLE_DIFF_EVENT } from "@/lib/ui-events";

export default function AuditoriaDetailNavbar() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const toast = useToast();
  const [title, setTitle] = useState<string>("Auditoría");
  const [openExport, setOpenExport] = useState(false);
  const [info, setInfo] = useState<any | null>(null);
  const [showUser, setShowUser] = useState(false);

  useEffect(() => {
    if (!id) return;
    apiFetch(`/api/auditorias/${id}`)
      .then(jsonOrNull)
      .then((d) => {
        if (d?.auditoria) {
          const a = d.auditoria;
          setInfo(a);
          const name =
            a.almacen?.nombre || a.material?.nombre || a.unidad?.nombre || a.id;
          setTitle(`Auditoría de ${a.tipo} - ${name}`);
        }
      })
      .catch(() => {});
  }, [id]);

  const volver = () => router.back();

  const exportar = async (formato: "pdf" | "excel" | "csv" | "json") => {
    if (!id) return;
    try {
      await fetchAuditoriaExport(id, formato);
    } catch {
      toast.show("Error al exportar", "error");
    }
  };

  const respaldar = async () => {
    if (!id) return;
    const res = await apiFetch(`/api/auditorias/${id}`);
    const data = await jsonOrNull(res);
    if (!data?.auditoria) {
      toast.show("Error al respaldar", "error");
      return;
    }
    const blob = new Blob([JSON.stringify(data.auditoria, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `auditoria_${id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const restaurar = async () => {
    if (!id) return;
    const ok = await toast.confirm("¿Restaurar elemento?");
    if (!ok) return;
    const res = await apiFetch(`/api/auditorias/${id}/restore`, { method: "POST" });
    if (res.ok) toast.show("Restaurado", "success");
    else toast.show("Error al restaurar", "error");
  };

  const eliminar = async () => {
    if (!id) return;
    const ok = await toast.confirm("¿Eliminar auditoría?");
    if (!ok) return;
    const res = await apiFetch(`/api/auditorias/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.show("Eliminada", "success");
      router.back();
    } else toast.show("Error al eliminar", "error");
  };

  return (
    <header
      className="flex items-center justify-between h-[3.5rem] min-h-[3.5rem] px-3 md:px-4 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)] fixed left-0 right-0 z-30"
      style={{ top: 0 }}
    >
      <div className="flex items-center gap-3">
        <button onClick={volver} className="p-2 text-gray-400 hover:bg-white/10 rounded-lg" title="Regresar">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Image src="/logo-honeylabs.png" alt="HoneyLabs" width={28} height={28} className="rounded" />
        <span className="font-semibold text-sm">HoneyLabs</span>
      </div>
      <span className="flex-1 mx-4 text-center text-white text-lg font-semibold truncate">
        {title}
      </span>
      {info && (
        <div className="flex items-center gap-3 text-xs text-gray-300">
          <Clock className="w-4 h-4" />
          <span>{new Date(info.fecha).toLocaleString()}</span>
          {info.usuario?.nombre && (
            <div
              onMouseEnter={() => setShowUser(true)}
              onMouseLeave={() => setShowUser(false)}
              className="relative"
            >
              <span className="ml-2 h-6 w-6 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-semibold">
                {info.usuario.nombre[0].toUpperCase()}
              </span>
              {showUser && (
                <div className="absolute right-0 mt-1 px-2 py-1 text-xs rounded bg-black text-white whitespace-pre">
                  {info.usuario.nombre}
                  {info.usuario.correo && <div>{info.usuario.correo}</div>}
                  {info.usuario.roles?.length && (
                    <div>{info.usuario.roles.map((r: any) => r.nombre).join(', ')}</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div className="flex items-center gap-2 relative">
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setOpenExport((o) => !o)}
            className="p-2 hover:bg-white/10 rounded-lg"
            title="Exportar"
          >
            <Download className="w-5 h-5" />
          </button>
          {openExport && (
            <div className="absolute right-0 mt-2 bg-[var(--dashboard-sidebar)] border border-[var(--dashboard-border)] rounded shadow-md z-10">
              {(["pdf", "excel", "csv", "json"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    exportar(f);
                    setOpenExport(false);
                  }}
                  className="block px-3 py-1 text-sm text-left hover:bg-white/5 w-full"
                >
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={respaldar} className="p-2 hover:bg-white/10 rounded-lg" title="Respaldar">
          <FileText className="w-5 h-5" />
        </button>
        <button onClick={restaurar} className="p-2 hover:bg-white/10 rounded-lg" title="Restaurar">
          <RotateCcw className="w-5 h-5" />
        </button>
        <button onClick={() => window.dispatchEvent(new Event(AUDIT_TOGGLE_DIFF_EVENT))} className="p-2 hover:bg-white/10 rounded-lg" title="Comparar cambios">
          <History className="w-5 h-5" />
        </button>
        <button onClick={eliminar} className="p-2 hover:bg-white/10 rounded-lg" title="Eliminar auditoría">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
