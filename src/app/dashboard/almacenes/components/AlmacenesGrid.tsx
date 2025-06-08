"use client";
import Image from "next/image";
import type { Almacen } from "@/hooks/useAlmacenes";

export default function AlmacenesGrid({ almacenes, onOpen }: { almacenes: Almacen[]; onOpen: (id: number) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-oid="p2a3lo_">
      {almacenes.map((a) => (
        <div
          key={a.id}
          className="flex gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white/5"
          onClick={() => onOpen(a.id)}
        >
          <div className="w-24 h-24 flex-shrink-0 bg-white/10 rounded-md overflow-hidden">
            <Image
              src={a.imagenUrl || '/ilustracion-almacen-3d.svg'}
              alt={a.nombre}
              width={96}
              height={96}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex justify-between">
              <h3 className="font-semibold">{a.nombre}</h3>
              {a.ultimaActualizacion && (
                <span className="text-xs text-[var(--dashboard-muted)]">
                  {new Date(a.ultimaActualizacion).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="text-xs mt-1 flex gap-2">
              <span>📥 {a.entradas ?? 0}</span>
              <span>📤 {a.salidas ?? 0}</span>
              <span className="font-semibold text-lg">📦 {a.inventario ?? 0}</span>
            </div>
            <div className="mt-auto flex justify-between items-end">
              <span className="text-xs text-[var(--dashboard-muted)]">
                {a.encargado || 'Sin encargado'}
                {a.correo ? ` - ${a.correo}` : ''}
              </span>
              {a.notificaciones && (
                <span title="Notificaciones activas" className="text-[var(--dashboard-accent)]">🔔</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
