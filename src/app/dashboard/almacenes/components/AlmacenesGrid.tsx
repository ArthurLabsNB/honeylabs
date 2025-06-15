"use client";
import Image from "next/image";
import { Star } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { cn } from "@/lib/utils";
import type { Almacen } from "@/hooks/useAlmacenes";

export default function AlmacenesGrid({
  almacenes,
  onOpen,
  favoritos,
  onToggleFavorito,
}: {
  almacenes: Almacen[];
  onOpen: (id: number) => void;
  favoritos: number[];
  onToggleFavorito: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" data-oid="p2a3lo_">
      {almacenes.map((a) => (
        <div
          key={a.id}
          className="flex gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white/5"
          onClick={() => onOpen(a.id)}
        >
          <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-white/10 rounded-md overflow-hidden relative">
            <Image
              src={a.imagenUrl || '/ilustracion-almacen-3d.svg'}
              alt={a.nombre}
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold">{a.nombre}</h3>
              {a.ultimaActualizacion && (
                <span className="text-xs text-[var(--dashboard-muted)]">
                  {new Date(a.ultimaActualizacion).toLocaleDateString()}
                </span>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorito(a.id);
                }}
                className={cn(
                  'p-1 -mr-1 hover:text-yellow-400',
                  favoritos.includes(a.id) ? 'text-yellow-300' : 'text-white/50',
                )}
                title="Favorito"
                aria-label="Favorito"
              >
                <Star className="w-4 h-4" fill={favoritos.includes(a.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            <div className="text-xs mt-1 flex gap-2 items-center">
              <span>📥 {a.entradas ?? 0}</span>
              <span>📤 {a.salidas ?? 0}</span>
              <span className="font-semibold text-lg">📦 {a.inventario ?? 0}</span>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs',
                  (a.inventario ?? 0) > 0
                    ? 'bg-emerald-600 text-white'
                    : 'bg-red-600 text-white',
                )}
              >
                {(a.inventario ?? 0) > 0 ? 'Activo' : 'Vacío'}
              </span>
            </div>
            <div className="mt-auto flex justify-between items-end">
              <span className="text-xs text-[var(--dashboard-muted)]">
                {a.encargado || 'Sin encargado'}
                {a.correo ? ` - ${a.correo}` : ''}
              </span>
              {a.notificaciones && a.notificaciones > 0 && (
                <span
                  title={`${a.notificaciones} notificaciones sin leer`}
                  className="text-xs px-2 py-0.5 rounded-full bg-[var(--dashboard-accent)] text-[#101014] font-semibold"
                >
                  {a.notificaciones}
                </span>
              )}
            </div>
          </div>
          <div className="hidden sm:block ml-auto">
            <QRCodeSVG value={a.codigoUnico ?? ''} size={56} />
          </div>
        </div>
      ))}
    </div>
  );
}
