"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useRouter } from "next/navigation";
import { useAlmacenesUI } from "./ui";

interface Usuario {
  id: number;
  rol?: string;
  tipoCuenta?: string;
}

interface Almacen {
  id: number;
  nombre: string;
  descripcion?: string | null;
}

export default function AlmacenesPage() {
  const allowed = ["admin", "institucional", "empresarial", "estandar"];
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { view, filter, registerCreate } = useAlmacenesUI();

  useEffect(() => {
    fetch("/api/login", { credentials: "include" })
      .then(jsonOrNull)
      .then((data) => {
        if (!data?.success) throw new Error();
        const tipo =
          data.usuario.rol === "admin"
            ? "admin"
            : (data.usuario.tipoCuenta ?? "estandar");
        if (!allowed.includes(tipo)) {
          throw new Error("No autorizado");
        }
        setUsuario(data.usuario);
      })
      .catch((err) => {
        setError(err.message || "Debes iniciar sesión");
      });
  }, []);

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
      } else {
        alert(data.error || "Error al crear");
      }
    } catch {
      alert("Error de red");
    }
  };

  useEffect(() => {
    registerCreate(crearAlmacen);
  }, [registerCreate]);

  useEffect(() => {
    if (!usuario) return;
    setLoading(true);
    const fav = filter === "favoritos" ? "&favoritos=1" : "";
    fetch(`/api/almacenes?usuarioId=${usuario.id}${fav}`)
      .then(jsonOrNull)
      .then((data) => setAlmacenes(data.almacenes || []))
      .catch(() => setError("Error al cargar datos"))
      .finally(() => setLoading(false));
  }, [usuario, filter]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="-sahyud">
        {error}
      </div>
    );
  if (loading)
    return (
      <div className="p-4" data-oid=".75.gic">
        Cargando...
      </div>
    );

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    setAlmacenes((a) => {
      const arr = [...a];
      [arr[idx - 1], arr[idx]] = [arr[idx], arr[idx - 1]];
      return arr;
    });
  };

  const moveDown = (idx: number) => {
    if (idx === almacenes.length - 1) return;
    setAlmacenes((a) => {
      const arr = [...a];
      [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
      return arr;
    });
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar almacén?")) return;
    const res = await fetch(`/api/almacenes/${id}`, { method: "DELETE" });
    if (res.ok) {
      setAlmacenes((a) => a.filter((x) => x.id !== id));
    } else {
      alert("Error al eliminar");
    }
  };

  const renderList = () => (
    <ul className="divide-y" data-oid="8u6yxkq">
      {almacenes.map((a, idx) => (
        <li
          key={a.id}
          className="p-2 hover:bg-white/5 flex justify-between"
          data-oid="9s2fhal"
        >
          <div
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/almacenes/${a.id}`)}
            data-oid="zdd63d2"
          >
            <h3 className="font-semibold" data-oid="w-g._8_">
              {a.nombre}
            </h3>
            {a.descripcion && (
              <p
                className="text-sm text-[var(--dashboard-muted)]"
                data-oid="vq:52hi"
              >
                {a.descripcion}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm" data-oid="hk8r01j">
            <button
              onClick={() => moveUp(idx)}
              className="px-1"
              data-oid="93nu2d6"
            >
              ↑
            </button>
            <button
              onClick={() => moveDown(idx)}
              className="px-1"
              data-oid="1sz4w5d"
            >
              ↓
            </button>
            <button
              onClick={() => router.push(`/dashboard/almacenes/${a.id}/editar`)}
              className="px-1 text-blue-500"
              data-oid="g_u167:"
            >
              ✎
            </button>
            <button
              onClick={() => eliminar(a.id)}
              className="px-1 text-red-500"
              data-oid="ikhrfwa"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );

  const renderGrid = () => (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      data-oid="r3rp6ax"
    >
      {almacenes.map((a) => (
        <div
          key={a.id}
          className="p-4 border rounded-lg cursor-pointer hover:bg-white/5"
          onClick={() => router.push(`/dashboard/almacenes/${a.id}`)}
          data-oid="x.ws0fv"
        >
          <h3 className="font-semibold mb-1" data-oid="swcyj-9">
            {a.nombre}
          </h3>
          {a.descripcion && (
            <p
              className="text-sm text-[var(--dashboard-muted)]"
              data-oid="3my_o2p"
            >
              {a.descripcion}
            </p>
          )}
        </div>
      ))}
    </div>
  );

  const renderTree = () => (
    <ul className="list-disc pl-4" data-oid="q7.wqic">
      {almacenes.map((a) => (
        <li
          key={a.id}
          className="cursor-pointer hover:underline"
          onClick={() => router.push(`/dashboard/almacenes/${a.id}`)}
          data-oid="1lky8t9"
        >
          {a.nombre}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-4" data-oid="almacenes-page">
      {view === "list"
        ? renderList()
        : view === "grid"
          ? renderGrid()
          : renderTree()}
    </div>
  );
}
