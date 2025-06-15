"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter as useNextRouter } from "next/navigation";
import Router from "next/router";
import { jsonOrNull } from "@lib/http";
import Spinner from "@/components/Spinner";
import { useToast } from "@/components/Toast";
import { Material } from "../components/MaterialRow";
import useMateriales from "@/hooks/useMateriales";
import MaterialForm from "../components/MaterialForm";
import MaterialList from "../components/MaterialList";
import UnidadesPanel from "./UnidadesPanel";
import UnidadForm from "../components/UnidadForm";
import HistorialMovimientosPanel from "./HistorialMovimientosPanel";
import HistorialAlmacenPanel from "./HistorialAlmacenPanel";
import ExportNavbar from "../components/ExportNavbar";
import { generarUUID } from "@/lib/uuid";
import type { UnidadDetalle } from "@/types/unidad-detalle";
import useUnidades from "@/hooks/useUnidades";
import QuickInventoryModal from "./QuickInventoryModal";

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
  const [dirty, setDirty] = useState(false);
  const updateDirty = (v: boolean) => {
    setDirty(v);
    window.dispatchEvent(new CustomEvent('almacen-dirty', { detail: v }));
  };
  const [panel, setPanel] = useState<'material' | 'unidad'>('material');
  const [unidadSel, setUnidadSel] = useState<UnidadDetalle | null>(null);
  const [historialBackup, setHistorialBackup] = useState<any | null>(null);
  const [showQuick, setShowQuick] = useState(false);

  const routerNav = useNextRouter();
  const selectedMaterial = historialBackup
    ? ({
        id: 'backup',
        ...historialBackup,
        miniatura: null,
        miniaturaUrl: historialBackup.miniatura
          ? `data:image/*;base64,${historialBackup.miniatura}`
          : null,
        archivos: historialBackup.archivos ?? [],
      } as Material)
    : selectedId
      ? materiales.find((m) => m.id === selectedId) ?? null
      : null;
  const { actualizar: actualizarUnidad, obtener } = useUnidades(selectedMaterial?.dbId);

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
    updateDirty(false)
  }, [fetchedMateriales])

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
    updateDirty(false)
  };

  const cancelar = () => {
    mutate();
    setSelectedId(null);
    setHistorialBackup(null);
    updateDirty(false);
  };

  const guardarUnidad = async () => {
    if (!unidadSel?.id || !unidadSel.nombreMaterial) {
      setPanel('material');
      return;
    }
    const { id: uid, nombreMaterial, ...rest } = unidadSel
    delete (rest as any).nombre
    const res = await actualizarUnidad({ id: uid, nombre: nombreMaterial, ...rest })
    if (res?.error) toast.show(res.error, 'error')
    else toast.show('Guardado', 'success')
    setPanel('material')
  };

  useEffect(() => {
    if (!dirty) return
    let blocked = false
    const askSave = async (url?: string) => {
      const ok = await toast.confirm('¿Guardar todos los cambios?')
      if (ok) await guardar()
      else cancelar()
      if (url) routerNav.push(url)
    }
    const handleRoute = (url: string) => {
      if (blocked) return
      blocked = true
      Router.events.emit('routeChangeError')
      askSave(url).finally(() => {
        blocked = false
      })
      throw 'Abort route change'
    }
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return
      e.preventDefault()
      e.returnValue = ''
      askSave()
    }
    Router.events.on('routeChangeStart', handleRoute)
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      Router.events.off('routeChangeStart', handleRoute)
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [dirty, toast, routerNav, guardar, cancelar])

  useEffect(() => {
    const handleSave = () => guardar()
    const handleQuick = () => setShowQuick(true)
    const handleVaciar = async () => {
      const ok = await toast.confirm('¿Vaciar todos los materiales?')
      if (!ok) return
      const res = await fetch(`/api/almacenes/${id}/materiales`, { method: 'DELETE' })
      const data = await jsonOrNull(res)
      if (res.ok) {
        mutate()
        toast.show('Almacén vaciado', 'success')
      } else {
        toast.show(data?.error || 'Error', 'error')
      }
    }
    window.addEventListener('almacen-save', handleSave)
    window.addEventListener('quick-inventory', handleQuick)
    window.addEventListener('vaciar-materiales', handleVaciar)
    return () => {
      window.removeEventListener('almacen-save', handleSave)
      window.removeEventListener('quick-inventory', handleQuick)
      window.removeEventListener('vaciar-materiales', handleVaciar)
    }
  }, [guardar, mutate, toast, id])

  const filtrados = useMemo(
    () =>
      materiales
        .filter((m) => (m?.nombre ?? "").toLowerCase().includes(busqueda.toLowerCase()))
        .sort((a, b) =>
          orden === "nombre" ? a.nombre.localeCompare(b.nombre) : a.cantidad - b.cantidad,
        ),
    [materiales, busqueda, orden],
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
    updateDirty(true)
  }

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
    } else {
      toast.show('Descartado', 'success')
    }
    mutate()
    setSelectedId(null)
    updateDirty(false)
  };
  const duplicar = () => {
    if (!selectedId) return
    const orig = materiales.find((m) => m.id === selectedId)
    if (orig) {
      const copia = {
        ...orig,
        id: generarUUID(),
        dbId: undefined,
        nombre: `${orig.nombre} (copia)`,
        lote: '',
      }
      setMateriales((ms) => [...ms, copia])
      setSelectedId(copia.id)
      updateDirty(true)
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
          {panel === 'material' && (
            <>
              {historialBackup && <ExportNavbar material={selectedMaterial} />}
              <MaterialForm
                key={historialBackup ? 'hist' : selectedId ?? 'new'}
                material={selectedMaterial}
                onChange={(campo, valor) =>
                  selectedId && actualizar(selectedId, campo, valor)
                }
                onGuardar={guardar}
                onCancelar={cancelar}
                onDuplicar={duplicar}
                onEliminar={eliminar}
                readOnly={Boolean(historialBackup)}
              />
            </>
          )}
          {panel === 'unidad' && (
            <UnidadForm
              key={unidadSel?.id ?? 'unidad'}
              unidad={unidadSel}
              onChange={(campo, valor) =>
                setUnidadSel((d) => (d ? { ...d, [campo]: valor } : d))
              }
              onGuardar={guardarUnidad}
              onCancelar={() => setPanel('material')}
            />
          )}
        </section>
        <aside className="md:w-1/2 p-4 space-y-4 overflow-y-auto">
          <MaterialList
            materiales={materiales}
            selectedId={selectedId}
            onSeleccion={(idSel) => {
              setHistorialBackup(null);
              setSelectedId(idSel);
            }}
            busqueda={busqueda}
            setBusqueda={setBusqueda}
            orden={orden}
            setOrden={setOrden}
            onNuevo={() => {
              const nuevoId = generarUUID()
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
                  archivos: [],
                },
              ])
              setSelectedId(nuevoId)
              updateDirty(true)
            }}
            onDuplicar={duplicar}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UnidadesPanel
              material={selectedMaterial}
              onChange={(campo, valor) =>
                selectedId && actualizar(selectedId, campo, valor)
              }
              onSelect={async (u) => {
                const info = await obtener(u.id)
                if (info) {
                  setUnidadSel({ nombreMaterial: u.nombre, ...info })
                  setPanel('unidad')
                }
              }}
            />
            <HistorialMovimientosPanel
              material={selectedMaterial}
              onSelectHistorial={(estado) => {
                setHistorialBackup(estado);
                setSelectedId(null);
              }}
            />
            <HistorialAlmacenPanel almacenId={Number(id)} />
          </div>
        </aside>
      </div>
      {showQuick && almacen && (
        <QuickInventoryModal
          data={{
            entradas: almacen.entradas ?? 0,
            salidas: almacen.salidas ?? 0,
            inventario: almacen.inventario ?? 0,
          }}
          onClose={() => setShowQuick(false)}
        />
      )}
    </div>
  );
}

