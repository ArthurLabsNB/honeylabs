"use client";
import Image from "next/image";

import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { memo } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { POINTER_ACTIVATION_DISTANCE } from "../../constants";
import { Pencil, Trash2, Star } from "lucide-react";
import type { Almacen } from "@/hooks/useAlmacenes";

interface Props {
  almacenes: Almacen[];
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onOpen: (id: number) => void;
  onDragStart: (ev: DragStartEvent) => void;
  onDragOver: (ev: DragOverEvent) => void;
  onDragEnd: (ev: DragEndEvent) => void;
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
  onDragOver,
  onDragEnd,
  onMove,
  favoritos,
  onToggleFavorito,
}: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: POINTER_ACTIVATION_DISTANCE } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
      <SortableContext items={almacenes.map((a) => a.id)} strategy={verticalListSortingStrategy}>
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
              onMove={(dir) => onMove(a.id, dir)}
            />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  );
}

// Flechas arriba y abajo permiten reordenar el elemento cuando tiene el foco.
const SortableAlmacen = memo(function SortableAlmacen({
  almacen,
  onEdit,
  onDelete,
  onOpen,
  onMove,
  favorito,
  onToggleFavorito,
}: {
  almacen: Almacen;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
  onMove: (dir: number) => void;
  favorito: boolean;
  onToggleFavorito: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: almacen.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  return (
    <motion.li
      ref={setNodeRef}
      style={style}
      whileDrag={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      {...attributes}
      {...listeners}
      tabIndex={0}
      className="relative"
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
        isDragging && "shadow-lg ring-2 ring-[var(--dashboard-accent)]"
      )}
    >
      <div className="flex flex-col items-center ml-2" onClick={onOpen}>
        <div className="w-28 h-28 flex-shrink-0 rounded-md overflow-hidden bg-white/10">
          <Image
            src={almacen.imagenUrl || '/ilustracion-almacen-3d.svg'}
            alt={almacen.nombre}
            width={112}
            height={112}
            sizes="112px"
            className="object-cover w-full h-full"
          />
        </div>
        <div className="text-sm text-center mt-3">
          {almacen.encargado || 'Sin encargado'}
          {almacen.correo ? ` - ${almacen.correo}` : ''}
        </div>
      </div>
      <span className="absolute top-2 right-2 text-xs text-[var(--dashboard-muted)]">
        {dayjs(almacen.fechaCreacion).format('DD/MM/YYYY')}
      </span>
      <div className="flex flex-col flex-1" onClick={onOpen}>
        <h3 className="font-semibold text-base">{almacen.nombre}</h3>
        <span
          className={cn(
            "px-1 py-0.5 rounded text-[9px]",
            (almacen.inventario ?? 0) > 0
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white",
          )}
        >
          {(almacen.inventario ?? 0) > 0 ? "Act." : "Vac."}
        </span>
        <ul className="mt-1 space-y-1 list-disc list-inside">
          <li className="text-sm font-medium">
            <span
              className={
                (almacen.inventario ?? 0) > 0
                  ? 'text-white font-semibold'
                  : 'text-[var(--dashboard-muted)]'
              }
            >
              Materiales:
            </span>
            <span className="text-yellow-400 ml-1">
              {almacen.inventario ?? 0}
            </span>
          </li>
          <li className="text-sm font-medium">
            <span
              className={
                (almacen.unidades ?? 0) > 0
                  ? 'text-white font-semibold'
                  : 'text-[var(--dashboard-muted)]'
              }
            >
              Unidades:
            </span>
            <span className="text-yellow-400 ml-1">
              {almacen.unidades ?? 0}
            </span>
          </li>
        </ul>
        {almacen.descripcion && (
          <p className="text-xs text-[var(--dashboard-muted)] mt-1">
            {almacen.descripcion}
          </p>
        )}
        <div className="flex justify-between text-xs mt-auto">
          {almacen.ultimaActualizacion && (
            <span>{dayjs(almacen.ultimaActualizacion).format('DD/MM/YYYY')}</span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end ml-2">
        <div className="flex items-start gap-2">
          <QRCodeSVG value={almacen.codigoUnico ?? ''} size={112} className="mr-2" />
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onMove(-1)}
              className="py-1.5 px-3 text-sm font-semibold text-white/70 hover:text-white"
            >
              Subir
            </button>
            <button
              onClick={() => onMove(1)}
              className="py-1.5 px-3 text-sm font-semibold text-white/70 hover:text-white"
            >
              Bajar
            </button>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={onEdit}
            className="p-1 hover:bg-white/20 rounded"
            aria-label="Editar"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 hover:bg-white/20 rounded text-red-500 hover:text-red-400"
            aria-label="Eliminar"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleFavorito}
            className={cn(
              'p-1 hover:text-yellow-400',
              favorito ? 'text-yellow-300' : 'text-white/50'
            )}
            aria-label={favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            title={favorito ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            <Star className="w-4 h-4" fill={favorito ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </motion.li>
  );
}, (prev, next) =>
  prev.almacen === next.almacen && prev.favorito === next.favorito
);
