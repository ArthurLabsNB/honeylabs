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
      <div className="p-4 text-red-500" data-oid="u6cxvra">
        {error}
      </div>
    );

  if (loading)
    return (
      <div className="p-4" data-oid="8xwpkrd">
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
    <ul className="divide-y" data-oid="riuw8_8">
      {almacenes.map((a, idx) => (
        <li
          key={a.id}
          className="p-2 hover:bg-white/5 flex justify-between"
          data-oid="d8g91a_"
        >
          <div
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/almacenes/${a.id}`)}
            data-oid="8t-4-9."
          >
            <h3 className="font-semibold" data-oid="-qh5kru">
              {a.nombre}
            </h3>
            {a.descripcion && (
              <p
                className="text-sm text-[var(--dashboard-muted)]"
                data-oid="jgiurkr"
              >
                {a.descripcion}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm" data-oid="lujybah">
            <button
              onClick={() => moveUp(idx)}
              className="px-1"
              data-oid="2ay3nmw"
            >
              ↑
            </button>
            <button
              onClick={() => moveDown(idx)}
              className="px-1"
              data-oid="l4bac8w"
            >
              ↓
            </button>
            <button
              onClick={() => router.push(`/dashboard/almacenes/${a.id}/editar`)}
              className="px-1 text-blue-500"
              data-oid="_g7zdy8"
            >
              ✎
            </button>
            <button
              onClick={() => eliminar(a.id)}
              className="px-1 text-red-500"
              data-oid="zwm-2s_"
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
      data-oid="p2a3lo_"
    >
      {almacenes.map((a) => (
        <div
          key={a.id}
          className="p-4 border rounded-lg cursor-pointer hover:bg-white/5"
          onClick={() => router.push(`/dashboard/almacenes/${a.id}`)}
          data-oid="j30ui.y"
        >
          <h3 className="font-semibold mb-1" data-oid="5bq_z65">
            {a.nombre}
          </h3>
          {a.descripcion && (
            <p
              className="text-sm text-[var(--dashboard-muted)]"
              data-oid="do4l.5a"
            >
              {a.descripcion}
            </p>
          )}
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
    <div className="p-4" data-oid="j7.ylhr">
      {view === "list"
        ? renderList()
        : view === "grid"
          ? renderGrid()
          : renderTree()}
    </div>
  );
}
