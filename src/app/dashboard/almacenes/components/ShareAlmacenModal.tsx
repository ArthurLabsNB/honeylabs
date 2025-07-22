"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@lib/api";
import { jsonOrNull } from "@lib/http";
import { useToast } from "@/components/Toast";

interface Props {
  id: number | string;
  nombre: string;
  onClose: () => void;
}

export default function ShareAlmacenModal({ id, nombre, onClose }: Props) {
  const toast = useToast();
  const [correos, setCorreos] = useState("");
  const [acceso, setAcceso] = useState<"restricto" | "dominio" | "publico">(
    "restricto",
  );
  const [terminacion, setTerminacion] = useState("");
  const [codigo, setCodigo] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  const copiar = async () => {
    try {
      const res = await apiFetch("/api/codigos/generar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          almacenId: id,
          rolAsignado: "lector",
          permisos: {
            correos: correos
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean),
            acceso,
            terminacion,
          },
        }),
      });
      const data = await jsonOrNull(res);
      if (res.ok && data?.codigo) {
        setCodigo(data.codigo);
        const url = `${window.location.origin}/api/almacenes/compartir?codigo=${data.codigo}`;
        await navigator.clipboard.writeText(url);
        toast.show("Enlace copiado", "success");
      } else {
        toast.show("Error al generar", "error");
      }
    } catch {
      toast.show("Error al generar", "error");
    }
  };

  const guardar = async () => {
    if (!codigo) {
      toast.show("Genera el enlace primero", "error");
      return;
    }
    setGuardando(true);
    try {
      const res = await apiFetch("/api/almacenes/compartir", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });
      if (res.ok) {
        toast.show("Configuración guardada", "success");
        onClose();
      } else {
        toast.show("Error al guardar", "error");
      }
    } catch {
      toast.show("Error al guardar", "error");
    }
    setGuardando(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-[var(--dashboard-card)] p-4 rounded-md w-80"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-semibold mb-2">Compartir {nombre}</h2>
        <label className="block text-xs mb-1">Correos permitidos</label>
        <textarea
          value={correos}
          onChange={(e) => setCorreos(e.target.value)}
          className="w-full h-16 p-2 bg-white/10 rounded text-sm mb-2"
          placeholder="correo@ejemplo.com, otro@ej.com"
        />
        <div className="mb-3">
          <p className="text-xs mb-1">Accesos</p>
          <label className="flex items-center gap-1 text-sm">
            <input
              type="radio"
              checked={acceso === "restricto"}
              onChange={() => setAcceso("restricto")}
            />
            Restringido
          </label>
          <label className="flex items-center gap-1 text-sm mt-1">
            <input
              type="radio"
              checked={acceso === "dominio"}
              onChange={() => setAcceso("dominio")}
            />
            Dominio
            {acceso === "dominio" && (
              <input
                value={terminacion}
                onChange={(e) => setTerminacion(e.target.value)}
                placeholder="@empresa.com"
                className="ml-2 p-1 text-xs bg-white/10 rounded w-28"
              />
            )}
          </label>
          <label className="flex items-center gap-1 text-sm mt-1">
            <input
              type="radio"
              checked={acceso === "publico"}
              onChange={() => setAcceso("publico")}
            />
            Cualquiera con enlace
          </label>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={copiar}
            className="px-3 py-1 bg-white/10 rounded text-sm"
          >
            Copiar URL
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            className="px-3 py-1 bg-[var(--dashboard-accent)] text-black rounded text-sm disabled:opacity-50"
          >
            Listo
          </button>
        </div>
      </div>
    </div>
  );
}
