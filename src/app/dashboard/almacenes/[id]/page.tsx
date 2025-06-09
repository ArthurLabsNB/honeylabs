"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jsonOrNull } from "@lib/http";
import Spinner from "@/components/Spinner";
import { useToast } from "@/components/Toast";
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
  const toast = useToast();
  const [almacen, setAlmacen] = useState<Almacen | null>(null);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [seleccion, setSeleccion] = useState<number | null>(0);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"producto" | "cantidad">("producto");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const cargarMateriales = async () => {
    const inv = await fetch(`/api/almacenes/${id}/materiales`).then(jsonOrNull);
    if (inv?.materiales) {
      setMateriales(
        inv.materiales.map((m: any) => ({
          ...m,
          producto: m.nombre,
          fechaCaducidad: m.fechaCaducidad?.slice(0, 10) ?? "",
        }))
      );
      if (inv.materiales.length === 0) setSeleccion(null);
    } else {
      setMateriales([]);
      setSeleccion(null);
    }
  };

  useEffect(() => {
    setLoading(true)
    fetch(`/api/almacenes/${id}`)
      .then(jsonOrNull)
      .then((info) => {
        if (info.error) throw new Error(info.error)
        setAlmacen(info.almacen)
        return cargarMateriales()
      })
      .catch(() => setError('Error al cargar almacén'))
      .finally(() => setLoading(false))
  }, [id])

  const filtrados = materiales
    .filter((m) => (m?.producto ?? "").toLowerCase().includes(busqueda.toLowerCase()))
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
    const form = new FormData();
   form.append('nombre', m.producto);
   if (m.descripcion) form.append('descripcion', m.descripcion);
   form.append('cantidad', String(m.cantidad));
   if (m.unidad) form.append('unidad', m.unidad);
   if (m.lote) form.append('lote', m.lote);
   if (m.fechaCaducidad) form.append('fechaCaducidad', m.fechaCaducidad);
   if (m.ubicacion) form.append('ubicacion', m.ubicacion);
   if (m.proveedor) form.append('proveedor', m.proveedor);
   if (m.estado) form.append('estado', m.estado);
    if (m.codigoBarra) form.append('codigoBarra', m.codigoBarra);
    if (m.codigoQR) form.append('codigoQR', m.codigoQR);
   if (m.observaciones) form.append('observaciones', m.observaciones);
    if (typeof m.minimo === 'number') form.append('minimo', String(m.minimo));
    if (typeof m.maximo === 'number') form.append('maximo', String(m.maximo));
    if (m.miniatura) form.append('miniatura', m.miniatura);
    const res = await fetch(
      m.id ? `/api/materiales/${m.id}` : `/api/almacenes/${id}/materiales`,
      {
        method: m.id ? 'PUT' : 'POST',
        body: form,
      },
    );
    const data = await res.json();
    if (data.error) {
      toast.show(data.error, 'error');
      return;
    }
    toast.show('Guardado', 'success');
    await cargarMateriales();
  };
  const cancelar = () => {
    cargarMateriales();
    setSeleccion(null);
  };
  const eliminar = async () => {
    if (seleccion === null) return;
    const m = materiales[seleccion];
    if (m.id) {
      const res = await fetch(`/api/materiales/${m.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.error) {
        toast.show(data.error, 'error');
        return;
      }
      toast.show('Eliminado', 'success');
    }
    await cargarMateriales();
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
          Total de materiales: {almacen.inventario}
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
                  codigoBarra: '',
                  codigoQR: '',
                  minimo: 0,
                  maximo: 0,
                  miniatura: null,
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

