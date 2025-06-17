"use client";

import Link from "next/link";
import useSession from "@/hooks/useSession";

export default function NavbarPaneles() {
  const { usuario } = useSession();
  const plan = usuario?.plan?.nombre || "Free";

  const invitar = () => {
    const url = window.location.origin + "/dashboard/paneles";
    navigator.clipboard.writeText(url).then(() => {
      alert("Enlace copiado");
    });
  };

  return (
    <header
      className="dashboard-navbar flex items-center justify-between px-6 py-2 shadow bg-[var(--dashboard-navbar)] relative"
      style={{ minHeight: "70px" }}
    >
      <span className="relative font-extrabold text-lg tracking-widest select-none">
        HoneyLabs
        <span className="absolute left-0 -bottom-4 text-xs text-gray-400">{plan}</span>
      </span>
      <div className="flex items-center gap-4">
        <button onClick={invitar} className="px-3 py-1 rounded bg-white/10 text-sm">Invitar miembros</button>
        <Link
          href="/servicios"
          className="px-3 py-1 rounded bg-[var(--dashboard-accent)] text-black text-sm"
        >
          Mejorar plan
        </Link>
      </div>
    </header>
  );
}
