"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AlmacenNavbar({ nombre }: { nombre?: string }) {
  const router = useRouter();
  return (
    <header
      className="flex items-center justify-between p-2 border-b border-[var(--dashboard-border)] bg-[var(--dashboard-navbar)]"
      style={{ minHeight: "50px" }}
      data-oid="-bn4nll"
    >
      <div className="flex items-center gap-2" data-oid="2-vxevd">
        <button
          onClick={() => router.push("/dashboard/almacenes")}
          className="p-2 hover:bg-white/10 rounded"
          title="Volver"
          data-oid="73n6ezc"
        >
          <ArrowLeft className="w-5 h-5" data-oid="807h1l1" />
        </button>
        <span className="font-semibold text-lg" data-oid="w79kqwa">
          {nombre || "Almacén"}
        </span>
      </div>
    </header>
  );
}
