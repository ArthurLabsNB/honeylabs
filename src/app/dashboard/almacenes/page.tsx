"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Pencil, Trash } from "lucide-react";
import { motion } from "framer-motion";
import { jsonOrNull } from "@lib/http";
import { useRouter } from "next/navigation";
import { useAlmacenesUI } from "./ui";
import type { Usuario } from "@/types/usuario";
import { getMainRole, hasManagePerms, normalizeTipoCuenta } from "@lib/permisos";
import useSession from "@/hooks/useSession";
import { useToast } from "@/components/Toast";

interface Almacen {
  id: number;
  nombre: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  ultimaActualizacion?: string | null;
  entradas?: number;
  salidas?: number;
  inventario?: number;
  encargado?: string | null;
  correo?: string | null;
  notificaciones?: boolean;
}

function arrayMove<T>(arr: T[], from: number, to: number): T[] {
  const newArr = arr.slice();
  const [item] = newArr.splice(from, 1);
  newArr.splice(to, 0, item);
  return newArr;
}

export default function AlmacenesPage() {
  const allowed = ["admin", "administrador", "institucional", "empresarial", "individual"];
  const { usuario, loading: loadingUsuario } = useSession();
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const toast = useToast();
  const { view, filter, registerCreate } = useAlmacenesUI();
  const [dragId, setDragId] = useState<number | null>(null);

  useEffect(() => {
    if (loadingUsuario) return;
    if (!usuario) {
      setError("Debes iniciar sesión");
      return;
    }
    const rol = getMainRole(usuario)?.toLowerCase();
    const tipo = normalizeTipoCuenta(usuario.tipoCuenta);
    if (rol !== "admin" && rol !== "administrador" && !allowed.includes(tipo)) {
      setError("No autorizado");
      return;
    }
    setError("");
  }, [usuario, loadingUsuario]);

  const crearAlmacen = async (nombre: string, descripcion: string) => {
    try {
      const res = await fetch("/api/almacenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, descripcion }),
      });
      const data = await jsonOrNull(res);
      if (res.ok && data.almacen) {
        setAlmacenes((a) => [...a, data.almacen]);
        toast.show("Almacén creado", "success");
      } else {
        toast.show(data.error || "Error al crear", "error");
      }
    } catch {
      toast.show("Error de red", "error");
    }
  };

  useEffect(() => {
    registerCreate(crearAlmacen);
  }, [registerCreate]);

  useEffect(() => {
    if (!usuario) return;
    const interval = setInterval(() => {
      const fav = filter === "favoritos" ? "&favoritos=1" : "";
      fetch(`/api/almacenes?usuarioId=${usuario.id}${fav}`)
        .then(jsonOrNull)
        .then((data) => setAlmacenes(data.almacenes || []));
    }, 10000);
    return () => clearInterval(interval);
  }, [usuario, filter]);

  useEffect(() => {
    if (loadingUsuario || !usuario || error) return;
    setLoading(true);
    const fav = filter === "favoritos" ? "&favoritos=1" : "";
    fetch(`/api/almacenes?usuarioId=${usuario.id}${fav}`)
      .then(jsonOrNull)
      .then((data) => setAlmacenes(data.almacenes || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario, loadingUsuario, filter, error]);

  const eliminar = useCallback(async (id: number) => {
    const ok = await toast.confirm("¿Eliminar almacén?");
    if (!ok) return;
    const res = await fetch(`/api/almacenes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAlmacenes((a) => a.filter((x) => x.id !== id));
      toast.show("Almacén eliminado", "success");
    } else {
      toast.show("Error al eliminar", "error");
    }
  }, [toast]);

  const handleDragStart = useCallback((id: number) => {
    setDragId(id);
  }, []);

  const handleDragEnter = useCallback(
    (id: number) => {
      if (dragId === null || dragId === id) return;
      const oldIndex = almacenes.findIndex((a) => a.id === dragId);
      const newIndex = almacenes.findIndex((a) => a.id === id);
      setAlmacenes((items) => arrayMove(items, oldIndex, newIndex));
      setDragId(id);
    },
    [dragId, almacenes],
  );

  const handleDragEnd = useCallback(() => {
    setDragId(null);
  }, []);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="u6cxvra">
        {error}
      </div>
    );

  if (loading || loadingUsuario)
    return (
      <div className="p-4" data-oid="8xwpkrd">
        Cargando...
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

  return (
    <div className="p-4 relative" data-oid="j7.ylhr">
      {almacenes.length === 0 && usuario && (
        <FloatingAdd allowCreate={hasManagePerms(usuario)} />
      )}
      {view === "list"
        ? renderList()
        : view === "grid"
          ? renderGrid()
          : renderTree()}
    </div>
  );
}

function FloatingAdd({ allowCreate }: { allowCreate: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const toast = useToast();

  const conectar = () => {
    toast.show("Función de conexión pendiente", "info");
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full bg-[var(--dashboard-accent)] text-white text-2xl shadow-lg"
      >
        +
      </button>
      {open && (
        <div className="absolute bottom-14 right-0 bg-[var(--dashboard-sidebar)] border border-[var(--dashboard-border)] rounded-md shadow-lg overflow-hidden flex flex-col">
          {allowCreate ? (
            <>
              <button
                onClick={() => router.push('/dashboard/almacenes/nuevo')}
                className="px-4 py-2 text-left hover:bg-white/5"
              >
                Crear nuevo almacén
              </button>
              <button
                onClick={conectar}
                className="px-4 py-2 text-left hover:bg-white/5 border-t border-[var(--dashboard-border)]"
              >
                Conectar con código
              </button>
            </>
          ) : (
            <>
              <button
                onClick={conectar}
                className="px-4 py-2 text-left hover:bg-white/5"
              >
                Conectar con código
              </button>
              <span className="p-2 text-xs text-[var(--dashboard-muted)] max-w-xs">
                Tu cuenta no permite crear almacenes. Usa un código de conexión.
              </span>
            </>
          )}
        </div>
      )}
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
