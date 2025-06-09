"use client";
import { useEffect, useState } from "react";
import { jsonOrNull } from "@lib/http";
import { useParams } from "next/navigation";
import Spinner from "@/components/Spinner";
import MaterialRow, { Material } from "../components/MaterialRow";

interface Almacen {
  id: number;
  nombre: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  encargado?: string | null;
  correo?: string | null;
  ultimaActualizacion?: string | null;
}


export default function AlmacenDetallePage() {
  const params = useParams();
  const id = params.id as string;
  const [almacen, setAlmacen] = useState<Almacen | null>(null);
  const [filas, setFilas] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/almacenes/${id}`)
      .then(jsonOrNull)
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAlmacen(data.almacen);
        setFilas(
          data.almacen?.inventario || [
            { producto: "Reactivo A", cantidad: 20, lote: "L001" },
            { producto: "Reactivo B", cantidad: 10, lote: "L002" },
          ],
        );
      })
      .catch(() => setError("Error al cargar almacén"))
      .finally(() => setLoading(false));
  }, [id]);

  if (error)
    return (
      <div className="p-4 text-red-500" data-oid="mmox.wc">
        {error}
      </div>
    );

  if (loading)
    return (
      <div className="p-4" data-oid="60abg5i">
        <Spinner />
      </div>
    );

  if (!almacen)
    return (
      <div className="p-4" data-oid="hf-4vbh">
        No encontrado
      </div>
    );

  const actualizar = (
    idx: number,
    campo: keyof Material,
    valor: string | number,
  ) => {
    setFilas((f) => {
      const arr = [...f];
      // @ts-ignore
      arr[idx][campo] = campo === "cantidad" ? Number(valor) : valor;
      return arr;
    });
  };

  const agregarFila = () => {
    setFilas((f) => [...f, { producto: "", cantidad: 0, lote: "" }]);
  };

  return (
    <div className="space-y-4" data-oid="0hw.ll8">
      <h1 className="text-2xl font-bold" data-oid="1zoe091">
        {almacen.nombre}
      </h1>
      {almacen.descripcion && (
        <p className="text-sm text-[var(--dashboard-muted)]" data-oid="1ainm7s">
          {almacen.descripcion}
        </p>
      )}
      {almacen.encargado && (
        <p className="text-xs text-[var(--dashboard-muted)]">
          Responsable: {almacen.encargado}
          {almacen.correo ? ` (${almacen.correo})` : ''}
        </p>
      )}
      {almacen.ultimaActualizacion && (
        <p className="text-xs text-[var(--dashboard-muted)]">
          Última actualización:{' '}
          {new Date(almacen.ultimaActualizacion).toLocaleString()}
        </p>
      )}

      <table className="w-full text-sm bg-white/5 rounded-md overflow-hidden">
        <thead className="bg-white/10">
          <tr>
            <th className="px-3 py-2 text-left">Producto</th>
            <th className="px-3 py-2 text-left">Cantidad</th>
            <th className="px-3 py-2 text-left">Lote</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f, idx) => (
            <MaterialRow key={idx} material={f} index={idx} onChange={actualizar} />
          ))}
        </tbody>
      </table>

      <button
        onClick={agregarFila}
        className="px-4 py-2 bg-[var(--dashboard-accent)] text-white rounded-lg hover:bg-[var(--dashboard-accent-hover)] text-sm"
      >
        Agregar fila
      </button>
    </div>
  );
}
