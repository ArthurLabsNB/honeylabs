"use client";
import { ArrowLeft, Save, QrCode, ChevronUp, ChevronDown, Share2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import useSession from "@/hooks/useSession";
import UserMenu from "@/components/UserMenu";
import AlmacenTools from "./AlmacenTools";
import TabsMenu from "./TabsMenu";
import ShareAlmacenModal from "./ShareAlmacenModal";
import { jsonOrNull } from "@lib/http";
import { apiFetch } from "@lib/api";
import { useDashboardUI } from "../../ui";
import { useDetalleUI } from "../DetalleUI";
import { NAVBAR_HEIGHT } from "../../constants";
import { useToast } from "@/components/Toast";
import {
  AUDIT_CANCEL_EVENT,
  AUDIT_PREVIEW_EVENT,
  ALMACEN_DIRTY_EVENT,
  ALMACEN_SAVE_EVENT,
} from "@/lib/ui-events";

export default function AlmacenDetailNavbar() {
  const router = useRouter();
  const { id } = useParams();
  const { fullscreen } = useDashboardUI();
  const { usuario } = useSession();
  const { collapsed, toggleCollapsed } = useDetalleUI();
  const toast = useToast();
  const [auditActive, setAuditActive] = useState(false);
  const [nombre, setNombre] = useState("");
  const [original, setOriginal] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      setDirty((e as CustomEvent<boolean>).detail);
    };
    window.addEventListener(ALMACEN_DIRTY_EVENT, handler as EventListener);
    return () => window.removeEventListener(ALMACEN_DIRTY_EVENT, handler as EventListener);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      setAuditActive((e as CustomEvent<boolean>).detail);
    };
    window.addEventListener(AUDIT_PREVIEW_EVENT, handler as EventListener);
    return () => window.removeEventListener(AUDIT_PREVIEW_EVENT, handler as EventListener);
  }, []);

  useEffect(() => {
    apiFetch(`/api/almacenes/${id}`)
      .then(jsonOrNull)
      .then((d) => {
        if (d?.almacen?.nombre) {
          setNombre(d.almacen.nombre);
          setOriginal(d.almacen.nombre);
        }
      })
      .catch(() => {});
  }, [id]);

  const cambios = nombre !== original || dirty;

  const guardar = async () => {
    if (!cambios) return;
    setGuardando(true);
    const res = await apiFetch(`/api/almacenes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    if (res.ok) {
      setOriginal(nombre);
      toast.show("Almacén actualizado", "success");
      window.dispatchEvent(new Event(ALMACEN_SAVE_EVENT));
    } else {
      toast.show("Error al guardar", "error");
    }
    setGuardando(false);
  };

  const volver = async () => {
    if (cambios) {
      const ok = await toast.confirm("¿Guardar cambios antes de salir?");
      if (ok) {
        await guardar();
      }
    }
    router.push("/dashboard/almacenes");
  };


  return (
    <>
    <header
      className={`flex items-center justify-between h-[3.5rem] min-h-[3.5rem] px-3 md:px-4 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)] fixed left-0 right-0 z-30 transition-transform duration-300 ${collapsed ? '-translate-y-full' : 'translate-y-0'}`}
      style={{ top: fullscreen ? 0 : NAVBAR_HEIGHT }}
    >
      <div className="flex items-center gap-3">
        <button onClick={volver} className="p-2 text-gray-400 hover:bg-white/10 rounded-lg" title="Regresar">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Image src="/logo-honeylabs.png" alt="HoneyLabs" width={28} height={28} className="rounded" />
        <span className="font-semibold text-sm">HoneyLabs</span>
      </div>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="bg-transparent text-center flex-1 mx-4 text-white text-lg font-semibold focus:outline-none"
      />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 mr-2">
          <button
            onClick={() => router.push(`/dashboard/almacenes/${id}/scan`)}
            className="p-2 hover:bg-white/10 rounded-lg"
            title="Escanear"
          >
            <QrCode className="w-5 h-5" />
          </button>
          {auditActive && (
            <button
            onClick={() =>
              window.dispatchEvent(new Event(AUDIT_CANCEL_EVENT))
            }
              className="p-2 hover:bg-white/10 rounded-lg"
              title="Salir de auditoría"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>
        <TabsMenu />
        <AlmacenTools id={id as string} />
        <button
          onClick={() => setShareOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg"
          title="Compartir"
        >
          <Share2 className="w-5 h-5" />
        </button>
        <button
          onClick={guardar}
          disabled={!cambios || guardando}
          className={`flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-colors ${cambios ? "bg-[var(--dashboard-accent)] text-black hover:bg-[var(--dashboard-accent-hover)]" : "bg-gray-600 text-gray-300"}`}
        >
          <Save className="w-4 h-4" /> Guardar
        </button>
        {cambios && (
          <span
            className="ml-1 w-2 h-2 rounded-full bg-red-500 animate-pulse"
            title="Cambios sin guardar"
          />
        )}
        {usuario && (
          <UserMenu usuario={usuario} />
        )}
        <button onClick={toggleCollapsed} className="p-2 hover:bg-white/10 rounded-lg ml-2" title={collapsed ? 'Expandir barra' : 'Ocultar barra'}>
          {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>
    </header>
    {shareOpen && (
      <ShareAlmacenModal
        id={id as string}
        nombre={nombre}
        onClose={() => setShareOpen(false)}
      />
    )}
    </>
  );
}
