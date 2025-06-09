"use client";
import { useState } from "react";
import MaterialRow, { Material } from "../components/MaterialRow";

export default function InventarioPage() {
  const [materiales, setMateriales] = useState<Material[]>([
    { id: crypto.randomUUID(), nombre: "Reactivo A", cantidad: 20, lote: "L001" },
    { id: crypto.randomUUID(), nombre: "Reactivo B", cantidad: 10, lote: "L002" },
  ]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"nombre" | "cantidad">("nombre");

  const filtrados = materiales
    .filter((m) => m.nombre.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) =>
      orden === "nombre"
        ? a.nombre.localeCompare(b.nombre)
        : a.cantidad - b.cantidad
    );

  const actualizar = (
    idMat: string,
    campo: keyof Material,
    valor: string | number,
  ) => {
    setMateriales((ms) =>
      ms.map((m) =>
        m.id === idMat ? { ...m, [campo]: campo === "cantidad" ? Number(valor) : valor } : m,
      ),
    );
  };

  const guardar = () => {
    alert("Guardado");
  };
  const cancelar = () => setSelectedId(null);
  const duplicar = () => {
    if (!selectedId) return;
    const m = materiales.find((mat) => mat.id === selectedId);
    if (m) {
      const nuevo = {
        ...m,
        id: crypto.randomUUID(),
        nombre: `${m.nombre} (copia)`,
        lote: "",
      };
      setMateriales((ms) => [...ms, nuevo]);
      setSelectedId(nuevo.id);
    }
  };

  return (
    <div className="flex h-full" data-oid="inv.layout">
      <aside className="w-72 max-w-sm border-r border-white/10 p-4 space-y-4">
        <div className="flex gap-2">
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar"
            className="flex-1 p-2 rounded-md bg-white/5 focus:outline-none"
          />
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value as any)}
            className="p-2 rounded-md bg-white/5"
          >
            <option value="nombre">Nombre</option>
            <option value="cantidad">Cantidad</option>
          </select>
        </div>
        <ul className="space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {filtrados.map((m) => (
            <li key={m.id}>
              <button
                onClick={() => setSelectedId(m.id)}
                className={`w-full text-left p-2 rounded-md transition ${
                  m.id === selectedId ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                {m.nombre}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <button
            onClick={() =>
              setMateriales((ms) => [
                ...ms,
                { id: crypto.randomUUID(), nombre: "", cantidad: 0, lote: "" },
              ])
            }
            className="flex-1 py-1 rounded-md bg-[var(--dashboard-accent)] text-white text-sm hover:bg-[var(--dashboard-accent-hover)]"
          >
            Nuevo
          </button>
          <button
            onClick={duplicar}
            disabled={selectedId === null}
            className="flex-1 py-1 rounded-md bg-white/10 text-white text-sm disabled:opacity-50"
          >
            Duplicar
          </button>
        </div>
      </aside>
      <section className="flex-1 p-4 space-y-4 overflow-y-auto">
        {selectedId === null ? (
          <p className="text-sm text-[var(--dashboard-muted)]">
            Selecciona un material para editar.
          </p>
        ) : (
          <>
            <table className="w-full text-sm bg-white/5 rounded-md overflow-hidden">
              <thead className="bg-white/10">
                <tr>
                  <th className="px-3 py-2 text-left">Producto</th>
                  <th className="px-3 py-2 text-left">Cantidad</th>
                  <th className="px-3 py-2 text-left">Lote</th>
                </tr>
              </thead>
              <tbody>
                <MaterialRow
                  id={selectedId!}
                  material={materiales.find((m) => m.id === selectedId)!}
                  onChange={actualizar}
                />
              </tbody>
            </table>
            <div className="flex gap-2">
              <button
                onClick={guardar}
                className="px-4 py-2 rounded-lg bg-[var(--dashboard-accent)] text-white text-sm hover:bg-[var(--dashboard-accent-hover)]"
              >
                Guardar
              </button>
              <button
                onClick={cancelar}
                className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={duplicar}
                className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm"
              >
                Duplicar
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
