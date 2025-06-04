"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AlmacenNavbar({ nombre }: { nombre?: string }) {
  const router = useRouter();
  return (
    <header className="flex items-center justify-between p-2 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]" style={{ minHeight: '50px' }}>
      <div className="flex items-center gap-2">
        <button onClick={() => router.push('/dashboard/almacenes')} className="p-2 hover:bg-white/10 rounded" title="Volver">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="font-semibold text-lg">{nombre || 'Almacén'}</span>
      </div>
    </header>
  );
}
