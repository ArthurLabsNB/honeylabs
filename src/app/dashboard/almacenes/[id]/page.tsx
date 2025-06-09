"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { jsonOrNull } from "@lib/http";
import Spinner from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { Material } from "../components/MaterialRow";
import useMateriales from "@/hooks/useMateriales";
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
  const {
    materiales: fetchedMateriales,
    loading: loadingMateriales,
    error: materialesError,
    crear,
    actualizar: actualizarMaterial,
    eliminar: eliminarMaterial,
    mutate,
  } = useMateriales(id as string);
  const [materiales, setMateriales] = useState<Material[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<"nombre" | "cantidad">("nombre");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true)
    fetch(`/api/almacenes/${id}`)
      .then(jsonOrNull)
      .then((info) => {
        if (info.error) throw new Error(info.error)
        setAlmacen(info.almacen)
      })
      .catch(() => setError('Error al cargar almacén'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    setMateriales(fetchedMateriales)
    if (fetchedMateriales.length === 0) setSelectedId(null)
  }, [fetchedMateriales])

  const filtrados = materiales
    .filter((m) => (m?.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) =>
      orden === "nombre" ? a.nombre.localeCompare(b.nombre) : a.cantidad - b.cantidad,
    );

  const numericFields: Array<keyof Material> = ['cantidad', 'minimo', 'maximo']

  const actualizar = <K extends keyof Material>(
    idMat: string,
    campo: K,
    valor: Material[K] | string,
  ) => {
    setMateriales((arr) => {
      const idx = arr.findIndex((m) => m.id === idMat)
      if (idx === -1) return arr
      const actualizado = {
        ...arr[idx],
        [campo]: numericFields.includes(campo)
          ? Number(valor)
          : (valor as Material[K]),
      }
      return [...arr.slice(0, idx), actualizado, ...arr.slice(idx + 1)]
    })
  }

  const guardar = async () => {
    if (!selectedId) return
    const m = materiales.find((mat) => mat.id === selectedId)
    if (!m) return
    const res = m.dbId ? await actualizarMaterial(m) : await crear(m)
    if (res?.error) {
      toast.show(res.error, 'error')
      return
    }
    toast.show('Guardado', 'success')
  };
  const cancelar = () => {
    mutate()
    setSelectedId(null)
  };
  const eliminar = async () => {
    if (!selectedId) return
    const m = materiales.find((mat) => mat.id === selectedId)
    if (m?.dbId) {
      const res = await eliminarMaterial(m.dbId)
      if (res?.error) {
        toast.show(res.error, 'error')
        return
      }
      toast.show('Eliminado', 'success')
    }
    mutate()
    setSelectedId(null)
  };
  const duplicar = () => {
    if (!selectedId) return
    const orig = materiales.find((m) => m.id === selectedId)
    if (orig) {
      const copia = {
        ...orig,
        id: crypto.randomUUID(),
        dbId: undefined,
        nombre: `${orig.nombre} (copia)`,
        lote: '',
      }
      setMateriales((ms) => [...ms, copia])
      setSelectedId(copia.id)
    }
  };

  const loadingTotal = loading || loadingMateriales
  const errorTotal = error || (materialesError ? 'Error al cargar materiales' : '')

  if (loadingTotal)
    return (
      <div className="p-4">
        <Spinner />
      </div>
    );

  if (errorTotal)
    return (
      <div className="p-4 text-red-500">
        {errorTotal}
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
            material={selectedId ? materiales.find((m) => m.id === selectedId) ?? null : null}
            onChange={(campo, valor) =>
              selectedId && actualizar(selectedId, campo, valor)
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
            selectedId={selectedId}
            onSeleccion={setSelectedId}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            orden={orden}
            setOrden={setOrden}
            onNuevo={() => {
              const nuevoId = crypto.randomUUID()
              setMateriales((ms) => [
                ...ms,
                {
                  id: nuevoId,
                  nombre: 'New',
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
              setSelectedId(nuevoId)
            }}
            onDuplicar={duplicar}
          />
        </aside>
      </div>
    </div>
  );
}

