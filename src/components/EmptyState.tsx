"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/Toast";

export default function EmptyState({ allowCreate }: { allowCreate: boolean }) {
  const router = useRouter();
  const toast = useToast();

  const conectar = () => {
    toast.show("Función de conexión pendiente", "info");
  };

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center">
      <Image
        src="/ilustracion-almacen-3d.svg"
        alt="Sin almacenes"
        width={160}
        height={160}
        sizes="(max-width: 640px) 120px, 160px"
        className="select-none"
      />
      <h2 className="text-lg font-semibold">Aún no hay almacenes</h2>
      {allowCreate ? (
        <div className="flex gap-2">
          <button
            onClick={() => router.push("/dashboard/almacenes/nuevo")}
            className="px-4 py-2 bg-[var(--dashboard-accent)] text-white rounded-md"
          >
            Crear nuevo almacén
          </button>
          <button
            onClick={conectar}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md"
          >
            Conectar con código
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2 items-center">
          <button
            onClick={conectar}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-md"
          >
            Conectar con código
          </button>
          <span className="text-xs text-[var(--dashboard-muted)] max-w-xs">
            Tu cuenta no permite crear almacenes. Usa un código de conexión.
          </span>
        </div>
      )}
    </div>
  );
}
