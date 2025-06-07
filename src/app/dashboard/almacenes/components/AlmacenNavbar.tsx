"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAlmacenesUI } from "../ui";
import useSession from "@/hooks/useSession";
import { hasManagePerms } from "@lib/permisos";

export default function AlmacenNavbar() {
  const { usuario } = useSession();
  const router = useRouter();
  const { onCreate } = useAlmacenesUI();
  const [open, setOpen] = useState(false);

  const allowCreate = usuario ? hasManagePerms(usuario) : false;

  const conectar = () => {
    const codigo = prompt("Código de almacén:");
    if (codigo) {
      // Placeholder de conexión
      alert(`Conectar a almacén ${codigo}`);
    }
  };

  const crear = () => {
    if (onCreate) return onCreate("", "");
    router.push("/dashboard/almacenes/nuevo");
  };

  return (
    <header className="flex items-center justify-between h-full w-full px-4">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="dashboard-btn flex items-center gap-2 h-9 px-3"
        >
          <Plus className="w-4 h-4" />
          <span>Almacén</span>
        </button>
        {open && (
          <div className="absolute left-0 mt-2 bg-[var(--dashboard-sidebar)] border border-[var(--dashboard-border)] rounded-md shadow-lg flex flex-col z-50">
            {allowCreate && (
              <button onClick={crear} className="px-4 py-2 text-left hover:bg-white/5">
                Crear nuevo
              </button>
            )}
            <button
              onClick={conectar}
              className="px-4 py-2 text-left hover:bg-white/5 border-t border-[var(--dashboard-border)]"
            >
              Conectar con código
            </button>
          </div>
        )}
      </div>
      <h1 className="text-lg font-semibold">Almacenes</h1>
    </header>
  );
}
