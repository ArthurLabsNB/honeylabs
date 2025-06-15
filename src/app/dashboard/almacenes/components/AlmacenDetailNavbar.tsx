"use client";
import { ArrowLeft, Save, Search, ClipboardList, Trash2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import useSession from "@/hooks/useSession";
import UserMenu from "@/components/UserMenu";
import AlmacenTools from "./AlmacenTools";
import { jsonOrNull } from "@lib/http";
import { useDashboardUI } from "../../ui";
import { NAVBAR_HEIGHT } from "../../constants";
import { useToast } from "@/components/Toast";

export default function AlmacenDetailNavbar() {
  const router = useRouter();
  const { id } = useParams();
  const { fullscreen } = useDashboardUI();
  const { usuario } = useSession();
  const toast = useToast();
  const [nombre, setNombre] = useState("");
  const [original, setOriginal] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      setDirty((e as CustomEvent<boolean>).detail);
    };
    window.addEventListener('almacen-dirty', handler as EventListener);
    return () => window.removeEventListener('almacen-dirty', handler as EventListener);
  }, []);

  useEffect(() => {
    fetch(`/api/almacenes/${id}`)
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
    const res = await fetch(`/api/almacenes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre }),
    });
    if (res.ok) {
      setOriginal(nombre);
      toast.show("Almacén actualizado", "success");
      window.dispatchEvent(new Event('almacen-save'));
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
    <header
      className="flex items-center justify-between h-[3.5rem] min-h-[3.5rem] px-4 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)] fixed left-0 right-0 z-30"
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
        <button
          onClick={() => window.dispatchEvent(new Event('quick-inventory'))}
          className="p-2 hover:bg-white/10 rounded-lg"
          title="Vista rápida"
        >
          <ClipboardList className="w-5 h-5" />
        </button>
        <button
          onClick={() => {
            const el = document.getElementById('busqueda-materiales') as HTMLInputElement | null
            el?.focus()
          }}
          className="p-2 hover:bg-white/10 rounded-lg"
          title="Buscar"
        >
          <Search className="w-5 h-5" />
        </button>
        <button
          onClick={() => window.dispatchEvent(new Event('vaciar-materiales'))}
          className="p-2 hover:bg-white/10 rounded-lg"
          title="Vaciar"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <AlmacenTools id={id as string} />
        <button
          onClick={guardar}
          disabled={!cambios || guardando}
          className={`flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-colors ${cambios ? "bg-[var(--dashboard-accent)] text-black hover:bg-[var(--dashboard-accent-hover)]" : "bg-gray-600 text-gray-300"}`}
        >
          <Save className="w-4 h-4" /> Guardar
        </button>
        {usuario && (
          <UserMenu usuario={usuario} />
        )}
      </div>
    </header>
  );
}
