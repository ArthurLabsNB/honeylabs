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
      <div className="w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-white/10 self-center" onClick={onOpen}>
        <Image
          src={almacen.imagenUrl || '/ilustracion-almacen-3d.svg'}
          alt={almacen.nombre}
          width={96}
          height={96}
          sizes="96px"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="text-xs text-center mt-1">
        {almacen.encargado || 'Sin encargado'}
        {almacen.correo ? ` - ${almacen.correo}` : ''}
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
        <ul className="text-xs flex gap-4 mt-1">
          <li>Cant. materiales: {almacen.inventario ?? 0}</li>
          <li>
            Cant. unidades:{' '}
            {(almacen.entradas ?? 0) - (almacen.salidas ?? 0)}
          </li>
          <li>Ubicación: N/A</li>
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
        <div className="my-auto">
          <QRCodeSVG value={almacen.codigoUnico ?? ''} size={64} />
        </div>
        <button onClick={onEdit} className="px-2 py-1 text-blue-500 hover:text-blue-400 text-xs">Editar</button>
        <button onClick={onDelete} className="px-2 py-1 text-red-500 hover:text-red-400 text-xs">Eliminar</button>
        <button onClick={onToggleFavorito} className="px-2 py-1 hover:text-yellow-400 text-xs">Favoritos</button>
        <button onClick={() => onMove(1)} className="px-2 py-1 text-white/70 hover:text-white text-xs">Bajar</button>
        <button onClick={() => onMove(-1)} className="px-2 py-1 text-white/70 hover:text-white text-xs">Subir</button>
      </div>
    </motion.li>
  );
}, (prev, next) =>
  prev.almacen === next.almacen && prev.favorito === next.favorito
);
