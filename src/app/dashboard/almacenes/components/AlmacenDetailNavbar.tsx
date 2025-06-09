"use client";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useDashboardUI } from "../../ui";
import { NAVBAR_HEIGHT } from "../../constants";
import { useToast } from "@/components/Toast";

export default function AlmacenDetailNavbar() {
  const router = useRouter();
  const { id } = useParams();
  const { fullscreen } = useDashboardUI();
  const toast = useToast();
  const [nombre, setNombre] = useState("");
  const [original, setOriginal] = useState("");
  const [guardando, setGuardando] = useState(false);

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

  const cambios = nombre !== original;

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
      className="flex items-center justify-between h-[56px] px-4 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)] fixed left-0 right-0 z-30"
      style={{ top: fullscreen ? 0 : NAVBAR_HEIGHT }}
    >
      <div className="flex items-center gap-3">
        <button onClick={volver} className="p-2 text-gray-400 hover:bg-white/10 rounded-lg" title="Regresar">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="bg-transparent text-white text-lg font-semibold focus:outline-none"
        />
      </div>
      <button
        onClick={guardar}
        disabled={!cambios || guardando}
        className={`flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-colors ${cambios ? "bg-[var(--dashboard-accent)] text-white hover:bg-[var(--dashboard-accent-hover)]" : "bg-gray-600 text-gray-300"}`}
      >
        <Save className="w-4 h-4" /> Guardar
      </button>
    </header>
  );
}
