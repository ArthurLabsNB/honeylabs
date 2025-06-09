"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jsonOrNull } from "@lib/http";
import Spinner from "@/components/Spinner";
import { Material } from "../components/MaterialRow";
import MaterialForm from "../components/MaterialForm";
import MaterialList from "../components/MaterialList";

interface Almacen {
  id: number;
  nombre: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  encargado?: string | null;
  correo?: string | null;
  ultimaActualizacion?: string | null;
  entradas?: number;
  salidas?: number;
  inventario?: number;
}

export default function AlmacenPage() {
  const { id } = useParams();
  const [almacen, setAlmacen] = useState<Almacen | null>(null);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [seleccion, setSeleccion] = useState<number | null>(0);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"producto" | "cantidad">("producto");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/almacenes/${id}`)
      .then(jsonOrNull)
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setAlmacen(data.almacen);
        setMateriales(data.almacen?.inventarioDetalle || []);
        if ((data.almacen?.inventarioDetalle || []).length === 0) {
          setSeleccion(null);
        }
      })
      .catch(() => setError("Error al cargar almacén"))
      .finally(() => setLoading(false));
  }, [id]);

  const filtrados = materiales
    .filter((m) => m.producto.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) =>
      orden === "producto" ? a.producto.localeCompare(b.producto) : a.cantidad - b.cantidad,
    );

  const actualizar = (
    idx: number,
    campo: keyof Material,
    valor: string | number,
  ) => {
    setMateriales((ms) => {
      const arr = [...ms];
      // @ts-ignore
      arr[idx][campo] = campo === "cantidad" ? Number(valor) : valor;
      return arr;
    });
  };

  const guardar = () => {
    alert("Guardado");
  };
  const cancelar = () => setSeleccion(null);
  const duplicar = () => {
    if (seleccion === null) return;
    setMateriales((ms) => [...ms, { ...ms[seleccion] }]);
  };

  if (loading)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );

  if (!almacen)
    return (
      <div className="p-4">
        No encontrado
      </div>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{almacen.nombre}</h1>
      {almacen.descripcion && (
        <p className="text-sm text-[var(--dashboard-muted)]">{almacen.descripcion}</p>
      )}
      {almacen.encargado && (
        <p className="text-xs text-[var(--dashboard-muted)]">
          Responsable: {almacen.encargado}
          {almacen.correo ? ` (${almacen.correo})` : ''}
        </p>
      )}
      {almacen.ultimaActualizacion && (
        <p className="text-xs text-[var(--dashboard-muted)]">
          Última actualización: {new Date(almacen.ultimaActualizacion).toLocaleString()}
        </p>
      )}
      {typeof almacen.inventario === 'number' && (
        <p className="text-xs text-[var(--dashboard-muted)]">
          Inventario actual: {almacen.inventario} u.
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-4 h-full">
        <section className="md:w-1/2 p-4 border-r border-white/10 overflow-y-auto">
          <MaterialForm
            material={seleccion !== null ? materiales[seleccion] : null}
            onChange={(campo, valor) =>
              seleccion !== null && actualizar(seleccion, campo, valor)
            }
            onGuardar={guardar}
            onCancelar={cancelar}
            onDuplicar={duplicar}
          />
        </section>
        <aside className="md:w-1/2 p-4 overflow-y-auto">
          <MaterialList
            materiales={materiales}
            seleccion={seleccion}
            onSeleccion={setSeleccion}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            orden={orden}
            setOrden={setOrden}
            onNuevo={() =>
              setMateriales((ms) => [...ms, { producto: '', cantidad: 0, lote: '' }])
            }
            onDuplicar={duplicar}
          />
        </aside>
      </div>
    </div>
  );
}

