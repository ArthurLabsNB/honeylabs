"use client";
import { ArrowLeft, Save, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useDashboardUI } from "../../ui";
import {
  SIDEBAR_GLOBAL_WIDTH,
  SIDEBAR_GLOBAL_COLLAPSED_WIDTH,
  NAVBAR_HEIGHT,
} from "../../constants";

export default function AlmacenDetailNavbar() {
  const router = useRouter();
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const [original, setOriginal] = useState("");
  const [guardando, setGuardando] = useState(false);
  const {
    fullscreen,
    sidebarGlobalCollapsed,
    sidebarGlobalVisible = true,
  } = useDashboardUI();

  const globalWidth = sidebarGlobalVisible
    ? sidebarGlobalCollapsed
      ? SIDEBAR_GLOBAL_COLLAPSED_WIDTH
      : SIDEBAR_GLOBAL_WIDTH
    : 0;

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
    } else {
      alert("Error al guardar");
    }
    setGuardando(false);
  };

  const volver = async () => {
    if (cambios) {
      if (confirm("¿Guardar cambios antes de salir?")) {
        await guardar();
      }
    }
    router.push("/dashboard/almacenes");
  };

  return (
    <header
      className="flex items-center justify-between h-14 px-4 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)] fixed z-30"
      style={{
        top: NAVBAR_HEIGHT,
        left: fullscreen ? 0 : globalWidth,
        right: 0,
        transition: "left 0.3s ease",
      }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={volver}
          className="p-2 text-gray-400 hover:bg-white/10 rounded-lg"
          title="Regresar"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="bg-transparent text-white text-lg font-semibold focus:outline-none"
        />
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/almacenes/nuevo"
          className="dashboard-btn h-9 w-9 flex items-center justify-center"
          title="Nuevo almacén"
        >
          <Plus className="w-4 h-4" />
        </Link>
        <button
          onClick={guardar}
          disabled={!cambios || guardando}
          className={`flex items-center gap-2 px-4 h-9 rounded-lg text-sm font-medium transition-colors ${cambios ? "bg-[var(--dashboard-accent)] text-white hover:bg-[var(--dashboard-accent-hover)]" : "bg-gray-600 text-gray-300"}`}
        >
          <Save className="w-4 h-4" /> Guardar
        </button>
      </div>
    </header>
  );
}
