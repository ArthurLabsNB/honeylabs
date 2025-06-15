"use client";
import Image from "next/image";
import { Pencil, Trash, ChevronUp, ChevronDown, Star } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import { memo, useState } from "react";
import { cn } from "@/lib/utils";
import type { Almacen } from "@/hooks/useAlmacenes";

interface Props {
  almacenes: Almacen[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onOpen: (id: number) => void;
  onDragStart: (id: number) => void;
  onDragEnter: (id: number) => void;
  onDragEnd: () => void;
  onMove: (id: number, dir: number) => void;
  favoritos: number[];
  onToggleFavorito: (id: number) => void;
}

export default function AlmacenesList({
  almacenes,
  onEdit,
  onDelete,
  onOpen,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onMove,
  favoritos,
  onToggleFavorito,
}: Props) {
  return (
    <ul className="space-y-2">
      {almacenes.map((a) => (
        <SortableAlmacen
          key={a.id}
          almacen={a}
          favorito={favoritos.includes(a.id)}
          onToggleFavorito={() => onToggleFavorito(a.id)}
          onEdit={() => onEdit(a.id)}
          onDelete={() => onDelete(a.id)}
          onOpen={() => onOpen(a.id)}
          onDragStart={() => onDragStart(a.id)}
          onDragEnter={() => onDragEnter(a.id)}
          onDragEnd={onDragEnd}
          onMove={(dir) => onMove(a.id, dir)}
        />
      ))}
    </ul>
  );
}

// Flechas arriba y abajo permiten reordenar el elemento cuando tiene el foco.
const SortableAlmacen = memo(function SortableAlmacen({
  almacen,
  onEdit,
  onDelete,
  onOpen,
  onDragStart,
  onDragEnter,
  onDragEnd,
  onMove,
  favorito,
  onToggleFavorito,
}: {
  almacen: Almacen;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
  onMove: (dir: number) => void;
  favorito: boolean;
  onToggleFavorito: () => void;
}) {
  const style = {};
  const [dragging, setDragging] = useState(false);

  return (
    <motion.li
      style={style}
      draggable
      whileDrag={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      onDragStart={(e) => {
        setDragging(true);
        onDragStart();
      }}
      onDragEnter={onDragEnter}
      onDragEnd={(e) => {
        setDragging(false);
        onDragEnd();
      }}
      onDragOver={(e) => e.preventDefault()}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault()
          onMove(-1)
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          onMove(1)
        } else if (e.key === 'Enter') {
          onOpen()
        }
      }}
      className={cn(
        "bg-white/5 hover:bg-white/10 p-3 rounded-md flex gap-3 cursor-grab active:cursor-grabbing",
        dragging && "shadow-lg ring-2 ring-[var(--dashboard-accent)]"
      )}
    >
      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-white/10" onClick={onOpen}>
        <Image
          src={almacen.imagenUrl || '/ilustracion-almacen-3d.svg'}
          alt={almacen.nombre}
          width={80}
          height={80}
          sizes="80px"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col flex-1" onClick={onOpen}>
        <div className="flex justify-between items-center gap-2">
          <h3 className="font-semibold">{almacen.nombre}</h3>
          <span className="text-lg font-semibold text-[var(--dashboard-accent)]">{almacen.inventario ?? 0} mat.</span>
          <span
            className={cn(
              "px-2 py-0.5 rounded-full text-xs",
              (almacen.inventario ?? 0) > 0
                ? "bg-emerald-600 text-white"
                : "bg-red-600 text-white",
            )}
          >
            {(almacen.inventario ?? 0) > 0 ? "Activo" : "Vacío"}
          </span>
        </div>
        {almacen.descripcion && (
          <p className="text-xs text-[var(--dashboard-muted)] mt-1">
            {almacen.descripcion}
          </p>
        )}
        <div className="flex justify-between text-xs mt-auto">
          <span>
            {almacen.encargado || 'Sin encargado'}
            {almacen.correo ? ` - ${almacen.correo}` : ''}
          </span>
          {almacen.ultimaActualizacion && (
            <span>{new Date(almacen.ultimaActualizacion).toLocaleDateString()}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end ml-2">
        <div className="mb-2">
          <QRCodeSVG value={almacen.codigoUnico ?? ''} size={48} />
        </div>
        <button
          onClick={onToggleFavorito}
          className={cn(
            'p-1 hover:text-yellow-400',
            favorito ? 'text-yellow-300' : 'text-white/50',
          )}
          title="Favorito"
          aria-label="Favorito"
        >
          <span className="sr-only">Favorito</span>
          <Star className="w-4 h-4" fill={favorito ? 'currentColor' : 'none'} />
        </button>
        <button
          onClick={() => onMove(-1)}
          className="p-1 text-white/70 hover:text-white"
          title="Subir"
          aria-label="Subir"
        >
          <span className="sr-only">Subir</span>
          <ChevronUp className="w-4 h-4" />
        </button>
        <button
          onClick={() => onMove(1)}
          className="p-1 text-white/70 hover:text-white"
          title="Bajar"
          aria-label="Bajar"
        >
          <span className="sr-only">Bajar</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button
          onClick={onEdit}
          className="p-1 text-blue-500 hover:text-blue-400"
          title="Editar"
          aria-label="Editar"
        >
          <span className="sr-only">Editar</span>
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-red-500 hover:text-red-400"
          title="Eliminar"
          aria-label="Eliminar"
        >
          <span className="sr-only">Eliminar</span>
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </motion.li>
  );
}, (prev, next) =>
  prev.almacen === next.almacen && prev.favorito === next.favorito
);
