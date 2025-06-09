"use client";
import { useState } from "react";
import useSession from "@/hooks/useSession";
import useAlmacenes from "@/hooks/useAlmacenes";
import useMateriales from "@/hooks/useMateriales";

export default function InventarioPage() {
  const { usuario } = useSession();
  const { almacenes } = useAlmacenes(
    usuario ? { usuarioId: usuario.id } : undefined,
  );
  const [almacenId, setAlmacenId] = useState<number | null>(null);
  const {
    materiales,
    loading: loadingMateriales,
  } = useMateriales(almacenId ?? undefined);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"nombre" | "cantidad">("nombre");

  const filtrados = materiales
    .filter((m) => (m?.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) =>
      orden === "nombre"
        ? a.nombre.localeCompare(b.nombre)
        : a.cantidad - b.cantidad,
    );

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Inventario</h1>
      <select
        value={almacenId ?? ""}
        onChange={(e) => setAlmacenId(Number(e.target.value) || null)}
        className="p-2 border rounded-md"
      >
        <option value="">Selecciona almacén</option>
        {almacenes.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nombre}
          </option>
        ))}
      </select>
      {loadingMateriales ? (
        <p>Cargando...</p>
      ) : (
        <table className="w-full text-sm bg-white/5 rounded-md overflow-hidden">
          <thead className="bg-white/10">
            <tr>
              <th className="px-3 py-2 text-left">Producto</th>
              <th className="px-3 py-2 text-left">Cantidad</th>
              <th className="px-3 py-2 text-left">Lote</th>
              <th className="px-3 py-2 text-left">Estado</th>
              <th className="px-3 py-2 text-left">Ubicación</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((m) => (
              <tr key={m.id} className="border-t border-white/10">
                <td className="px-3 py-2">{m.nombre}</td>
                <td className="px-3 py-2">{m.cantidad}</td>
                <td className="px-3 py-2">{m.lote}</td>
                <td className="px-3 py-2">{m.estado}</td>
                <td className="px-3 py-2">{m.ubicacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
