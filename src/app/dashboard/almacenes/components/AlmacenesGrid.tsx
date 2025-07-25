"use client";
import Image from 'next/image'
import { Star } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import { useRef, useState } from 'react'
import type { Almacen } from '@/hooks/useAlmacenes'

export default function AlmacenesGrid({
  almacenes,
  onOpen,
  favoritos,
  onToggleFavorito,
  onEdit,
  onDelete,
  onDuplicate,
}: {
  almacenes: Almacen[]
  onOpen: (id: number) => void
  favoritos: number[]
  onToggleFavorito: (id: number) => void
  onEdit?: (id: number) => void
  onDelete?: (id: number) => void
  onDuplicate?: (id: number) => void
}) {
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const qrRefs = useRef<Record<number, QRCodeSVG | null>>({})
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" data-oid="p2a3lo_">
      {almacenes.map((a) => (
        <div
          key={a.id}
          className="grid grid-cols-[96px_1fr_auto] gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white/5 transition"
          style={{ boxShadow: 'var(--dashboard-widget-glow)' }}
          onClick={() => onOpen(a.id)}
        >
          <div className="w-24 h-24 bg-white/10 rounded-md overflow-hidden relative">
            <Image
              src={a.imagenUrl || '/ilustracion-almacen-3d.svg'}
              alt={a.nombre}
              fill
              className="object-cover w-full h-full"
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">{a.nombre}</h3>
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-xs font-semibold',
                  (a.inventario ?? 0) > 0 ? 'bg-yellow-400 text-black' : 'bg-gray-500 text-white',
                )}
              >
                {a.inventario ?? 0}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorito(a.id);
                }}
                className={cn(
                  'ml-auto p-1 hover:text-yellow-400',
                  favoritos.includes(a.id) ? 'text-yellow-300' : 'text-white/50',
                )}
                title="Favorito"
                aria-label="Favorito"
              >
                <Star className="w-4 h-4" fill={favoritos.includes(a.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
            {a.descripcion && <p className="text-[0.875rem] text-[var(--dashboard-muted)]">{a.descripcion}</p>}
            {a.ultimaActualizacion && (
              <p className="text-[0.75rem] text-[var(--dashboard-muted)]">
                {dayjs(a.ultimaActualizacion).format('DD/MM/YYYY HH:mm')}
              </p>
            )}
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
              <span className="text-xs text-[var(--dashboard-muted)] mt-3">
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
          <div className="flex flex-col items-end gap-2 ml-auto relative">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setOpenMenu(openMenu === a.id ? null : a.id)
              }}
              className="p-1 text-white/70 hover:text-white"
              aria-label="Opciones"
            >
              ⋮
            </button>
            {openMenu === a.id && (
              <ul className="absolute right-0 top-6 bg-[var(--dashboard-card)] border border-[var(--dashboard-border)] rounded-md text-sm shadow-lg z-10">
                <li>
                  <button onClick={(e)=>{e.stopPropagation(); setOpenMenu(null); onEdit?.(a.id);}} className="block w-full text-left px-3 py-1 hover:bg-white/10">Editar</button>
                </li>
                <li>
                  <button onClick={(e)=>{e.stopPropagation(); setOpenMenu(null); onDuplicate?.(a.id);}} className="block w-full text-left px-3 py-1 hover:bg-white/10">Duplicar</button>
                </li>
                <li>
                  <button onClick={(e)=>{e.stopPropagation(); setOpenMenu(null); onDelete?.(a.id);}} className="block w-full text-left px-3 py-1 hover:bg-red-600/40">Eliminar</button>
                </li>
              </ul>
            )}
            <div className="flex items-center gap-1">
              <QRCodeSVG ref={(el) => (qrRefs.current[a.id] = el)} value={a.codigoUnico ?? ''} size={56} />
              <div className="flex flex-col gap-1">
                <button onClick={(e)=>{e.stopPropagation(); navigator.clipboard.writeText(a.codigoUnico ?? '')}} className="text-xs hover:underline">Copiar</button>
                <button onClick={(e)=>{e.stopPropagation(); const node=qrRefs.current[a.id]?.svgRef as SVGSVGElement|undefined;if(node){const data=new XMLSerializer().serializeToString(node);const url=URL.createObjectURL(new Blob([data],{type:'image/svg+xml'}));const link=document.createElement('a');link.href=url;link.download=`almacen-${a.id}.svg`;link.click();URL.revokeObjectURL(url);}}} className="text-xs hover:underline">Descargar</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
