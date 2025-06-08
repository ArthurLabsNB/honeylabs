"use client";
import { useCallback } from "react";
import Image from "next/image";
import { Pencil, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAlmacenesUI } from "./ui";
import { hasManagePerms } from "@lib/permisos";
import Spinner from "@/components/Spinner";
import EmptyState from "@/components/EmptyState";
import useAlmacenesLogic from "@/hooks/useAlmacenesLogic";
import type { Almacen } from "@/hooks/useAlmacenes";

export default function AlmacenesPage() {
  const router = useRouter();
  const { view } = useAlmacenesUI();
  const {
    usuario,
    almacenes,
    loading,
    error,
    handleDragStart,
    handleDragEnter,
    handleDragEnd,
    eliminar,
  } = useAlmacenesLogic();

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="u6cxvra">
        {error}
      </div>
    );

  if (loading)
    return (
      <div className="p-4" data-oid="8xwpkrd">
        <Spinner />
      </div>
    );

  const renderList = () => (
    <ul className="space-y-2">
      {almacenes.map((a) => (
        <SortableAlmacen
          key={a.id}
          almacen={a}
          onEdit={() => router.push(`/dashboard/almacenes/${a.id}/editar`)}
          onDelete={() => eliminar(a.id)}
          onOpen={() => router.push(`/dashboard/almacenes/${a.id}`)}
          onDragStart={() => handleDragStart(a.id)}
          onDragEnter={() => handleDragEnter(a.id)}
          onDragEnd={handleDragEnd}
        />
      ))}
    </ul>
  );

  const renderGrid = () => (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      data-oid="p2a3lo_"
    >
      {almacenes.map((a) => (
        <div
          key={a.id}
          className="flex gap-3 p-3 border rounded-lg cursor-pointer hover:bg-white/5"
          onClick={() => router.push(`/dashboard/almacenes/${a.id}`)}
        >
          <div className="w-24 h-24 flex-shrink-0 bg-white/10 rounded-md overflow-hidden">
            <Image
              src={a.imagenUrl || "/ilustracion-almacen-3d.svg"}
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
                {a.encargado || "Sin encargado"}
                {a.correo ? ` - ${a.correo}` : ""}
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

  const renderTree = () => (
    <ul className="list-disc pl-4" data-oid="pbcygko">
      {almacenes.map((a) => (
        <li
          key={a.id}
          className="cursor-pointer hover:underline"
          onClick={() => router.push(`/dashboard/almacenes/${a.id}`)}
          data-oid="d2wd5ww"
        >
          {a.nombre}
        </li>
      ))}
    </ul>
  );

  if (almacenes.length === 0)
    return (
      <div className="p-4" data-oid="j7.ylhr">
        {usuario && (
          <EmptyState allowCreate={hasManagePerms(usuario)} />
        )}
      </div>
    );

  return (
    <div className="p-4" data-oid="j7.ylhr">
      {view === "list"
        ? renderList()
        : view === "grid"
          ? renderGrid()
          : renderTree()}
    </div>
  );
}

function SortableAlmacen({
  almacen,
  onEdit,
  onDelete,
  onOpen,
  onDragStart,
  onDragEnter,
  onDragEnd,
}: {
  almacen: Almacen;
  onEdit: () => void;
  onDelete: () => void;
  onOpen: () => void;
  onDragStart: () => void;
  onDragEnter: () => void;
  onDragEnd: () => void;
}) {
  const style = {};

  return (
    <motion.li
      style={style}
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className="bg-white/5 hover:bg-white/10 p-3 rounded-md flex gap-3 cursor-grab active:cursor-grabbing"
    >
      <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden bg-white/10" onClick={onOpen}>
        <Image
          src={almacen.imagenUrl || '/ilustracion-almacen-3d.svg'}
          alt={almacen.nombre}
          width={80}
          height={80}
          className="object-cover w-full h-full"
        />
      </div>
      <div className="flex flex-col flex-1" onClick={onOpen}>
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{almacen.nombre}</h3>
          <span className="text-lg font-semibold text-[var(--dashboard-accent)]">{almacen.inventario ?? 0} u.</span>
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
        <button
          onClick={onEdit}
          className="p-1 text-blue-500 hover:text-blue-400"
          title="Editar"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1 text-red-500 hover:text-red-400"
          title="Eliminar"
        >
          <Trash className="w-4 h-4" />
        </button>
      </div>
    </motion.li>
  );
}
