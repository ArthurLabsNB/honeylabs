"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import useSession from "@/hooks/useSession";
import { useToast } from "@/components/Toast";

interface Almacen { id: number; nombre: string }

export default function OperacionesPage() {
  const { usuario } = useSession();
  const toast = useToast();
  const [almacenes, setAlmacenes] = useState<Almacen[]>([]);
  const [almacenId, setAlmacenId] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "salida">("entrada");
  const [cantidad, setCantidad] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    fetch(`/api/almacenes?usuarioId=${usuario.id}`)
      .then(jsonOrNull)
      .then((d) => setAlmacenes(d.almacenes || []));
  }, [usuario]);

  const registrar = async () => {
    if (!almacenId) return toast.show("Selecciona un almacén", "error");
    if (!cantidad || cantidad <= 0)
      return toast.show("Ingresa una cantidad válida", "error");
    setLoading(true);
    const res = await fetch(`/api/almacenes/${almacenId}/movimientos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tipo, cantidad }),
    });
    const data = await jsonOrNull(res);
    setLoading(false);
    if (res.ok) {
      setCantidad(0);
      toast.show("Movimiento registrado", "success");
    } else {
      toast.show(data.error || "Error al registrar", "error");
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Operaciones</h1>
      <select
        value={almacenId}
        onChange={(e) => setAlmacenId(e.target.value)}
        className="p-2 border rounded-md"
      >
        <option value="">Selecciona almacén</option>
        {almacenes.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nombre}
          </option>
        ))}
      </select>
      <div className="flex items-center gap-2">
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as any)}
          className="p-2 border rounded-md"
        >
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>
        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(Number(e.target.value))}
          className="p-2 border rounded-md w-24"
          placeholder="Cantidad"
        />
        <button
          onClick={registrar}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-[var(--dashboard-accent)] text-white"
        >
          {loading ? "Procesando..." : "Registrar"}
        </button>
      </div>
    </div>
  );
}
