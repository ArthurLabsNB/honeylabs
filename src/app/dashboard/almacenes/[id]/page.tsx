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
    setLoading(true)
    Promise.all([
      fetch(`/api/almacenes/${id}`).then(jsonOrNull),
      fetch(`/api/almacenes/${id}/materiales`).then(jsonOrNull),
    ])
      .then(([info, inv]) => {
        if (info.error) throw new Error(info.error)
        setAlmacen(info.almacen)
        if (inv?.materiales) {
          setMateriales(inv.materiales)
          if (inv.materiales.length === 0) setSeleccion(null)
        } else {
          setMateriales([])
          setSeleccion(null)
        }
      })
      .catch(() => setError('Error al cargar almacén'))
      .finally(() => setLoading(false))
  }, [id])

  const filtrados = materiales
    .filter((m) => m.producto.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) =>
      orden === "producto" ? a.producto.localeCompare(b.producto) : a.cantidad - b.cantidad,
    );

  const actualizar = (
    idx: number,
    campo: keyof Material,
    valor: any,
  ) => {
    setMateriales((ms) => {
      const arr = [...ms];
      // @ts-ignore
      if (campo === 'cantidad') arr[idx][campo] = Number(valor);
      else arr[idx][campo] = valor;
      return arr;
    });
  };

  const guardar = async () => {
    if (seleccion === null) return;
    const m = materiales[seleccion];
    const body = {
      nombre: m.producto,
      descripcion: m.descripcion,
      cantidad: m.cantidad,
      unidad: m.unidad,
      lote: m.lote,
      fechaCaducidad: m.fechaCaducidad,
      ubicacion: m.ubicacion,
      proveedor: m.proveedor,
      estado: m.estado,
      observaciones: m.observaciones,
      minimo: m.minimo,
      maximo: m.maximo,
    };
    const res = await fetch(
      m.id ? `/api/materiales/${m.id}` : `/api/almacenes/${id}/materiales`,
      {
        method: m.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    const data = await res.json();
    if (data.error) {
      alert(data.error);
      return;
    }
    if (!m.id) {
      setMateriales((ms) => {
        const arr = [...ms];
        arr[seleccion] = { ...m, id: data.material.id };
        return arr;
      });
    }
  };
  const cancelar = () => setSeleccion(null);
  const eliminar = async () => {
    if (seleccion === null) return;
    const m = materiales[seleccion];
    if (m.id) {
      await fetch(`/api/materiales/${m.id}`, { method: 'DELETE' });
    }
    setMateriales((ms) => ms.filter((_, idx) => idx !== seleccion));
    setSeleccion(null);
  };
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
            onEliminar={eliminar}
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
              setMateriales((ms) => [
                ...ms,
                {
                  producto: 'New',
                  cantidad: 0,
                  lote: '',
                  unidad: '',
                  minimo: 0,
                  maximo: 0,
                },
              ])
            }
            onDuplicar={duplicar}
          />
        </aside>
      </div>
    </div>
  );
}

