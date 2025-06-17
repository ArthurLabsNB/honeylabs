"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import useSession from "@/hooks/useSession";

export default function PanelDetailNavbar() {
  const { usuario } = useSession();
  const plan = usuario?.plan?.nombre || "Free";
  return (
    <header
      className="flex items-center justify-between h-[3.5rem] min-h-[3.5rem] px-4 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)] fixed left-0 right-0 z-30"
    >
      <div className="flex items-center gap-3">
        <Link href="/dashboard/paneles" className="p-2 text-gray-400 hover:bg-white/10 rounded-lg" title="Volver">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="relative font-semibold text-sm select-none">
          HoneyLabs
          <span className="absolute left-0 -bottom-4 text-xs text-gray-400">{plan}</span>
        </span>
      </div>
    </header>
  );
}
