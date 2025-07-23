"use client";
import { useCallback, useEffect, useState } from 'react';
import MaterialesTab from './tabs/MaterialesTab';
import UnidadesPanel from '../[id]/UnidadesPanel';
import AuditoriasPanel from '../[id]/AuditoriasPanel';
import MaterialForm from './MaterialForm';
import UnidadForm from './UnidadForm';
import { useBoard } from '../board/BoardProvider';
import useUnidades from '@/hooks/useUnidades';
import { useToast } from '@/components/Toast';
import { generarUUID } from '@/lib/uuid';
import { parseId } from '@/lib/parseId';
import type { Material } from './MaterialRow';
import type { UnidadDetalle } from '@/types/unidad-detalle';

export default function WarehouseBoard() {
  const {
    materiales,
    selectedId,
    setSelectedId,
    unidadSel,
    setUnidadSel,
    setAuditoriaSel,
    eliminar,
    crear,
    actualizar,
    duplicar,
    mutate,
  } = useBoard();
  const toast = useToast();

  const material = materiales.find(m => m.id === selectedId) || null;
  const [matDraft, setMatDraft] = useState<Material | null>(material);

  useEffect(() => {
    setMatDraft(material);
  }, [material]);

  const onEliminar = useCallback(async () => {
    const id = parseId(matDraft?.dbId);
    if (!id) {
      toast.show('ID inválido', 'error');
      return;
    }
    const ok = await toast.confirm('¿Eliminar material?');
    if (!ok) return;
    const res = await eliminar(id);
    if (res?.error) toast.show(res.error, 'error');
    else toast.show('Material eliminado', 'success');
    mutate();
    setSelectedId(null);
  }, [matDraft, eliminar, mutate, setSelectedId, toast]);

  const guardarMat = useCallback(async () => {
    if (!matDraft) return;
    if (!matDraft.nombre || !matDraft.nombre.trim()) {
      toast.show('Nombre vacío', 'warning');
    }
    const cantidad =
      typeof matDraft.cantidad === 'number' && !Number.isNaN(matDraft.cantidad)
        ? matDraft.cantidad
        : undefined;
    if (cantidad !== undefined && cantidad < 0) {
      toast.show('Cantidad inválida', 'error');
      return;
    }
    const data: any = { ...matDraft };
    if (cantidad !== undefined) data.cantidad = cantidad;
    const res = matDraft.dbId
      ? await actualizar(data as any)
      : await crear({ ...data, id: generarUUID() } as any);
    if (res?.error) {
      toast.show(res.error, 'error');
      return;
    }
    toast.show('Material guardado', 'success');
    mutate();
    if (res?.material?.id) {
      const id = String(res.material.id);
      setMatDraft(d => (d ? { ...d, dbId: res.material.id, id } : d));
      setSelectedId(id);
    }
  }, [matDraft, actualizar, crear, mutate, setSelectedId, toast]);

  const duplicarMat = useCallback(async () => {
    if (!matDraft) return;
    const { dbId, ...rest } = matDraft;
    await crear({ ...rest, id: generarUUID() } as any);
    mutate();
  }, [matDraft, crear, mutate]);

  const cancelarMat = () => {
    setSelectedId(null);
  };

  const { obtener, actualizar: actualizarU, mutate: mutateU } = useUnidades(material?.dbId);
  const [unidadDraft, setUnidadDraft] = useState<UnidadDetalle | null>(unidadSel);

  useEffect(() => {
    setUnidadDraft(unidadSel);
  }, [unidadSel]);

  const guardarUnidad = useCallback(async () => {
    if (!unidadDraft) return;
    const numericFields: Array<keyof UnidadDetalle> = ['peso', 'volumen', 'alto', 'largo', 'ancho'];
    const payload: any = { ...unidadDraft };
    for (const f of numericFields) {
      if (payload[f] == null) delete payload[f];
    }
    const res = await actualizarU(payload as any);
    if (res?.error) {
      toast.show(res.error, 'error');
      return;
    }
    toast.show('Unidad guardada', 'success');
    mutateU();
    if (res?.unidad?.id) {
      const id = res.unidad.id;
      setUnidadDraft(u => (u ? { ...u, id } : u));
      setUnidadSel(u => (u ? { ...u, id } : u));
    }
  }, [unidadDraft, actualizarU, mutateU, setUnidadSel, toast]);

  const cancelarUnidad = () => {
    setUnidadSel(null);
  };

  const openUnidad = useCallback(
    async (u: any) => {
      if (!u?.id) return;
      const info = await obtener(u.id);
      if (!info) return;
      setUnidadSel(info);
    },
    [obtener, setUnidadSel]
  );

  const openAuditoria = useCallback(
    (entry: any) => {
      if (!entry?.id) return;
      setAuditoriaSel(entry.id);
    },
    [setAuditoriaSel]
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-0 p-4 pb-10">
      <div className="md:w-1/2 md:pr-4 md:border-r md:border-[var(--dashboard-border)] space-y-4">
        {unidadSel ? (
          <UnidadForm
            unidad={unidadDraft}
            onChange={(c, v) => setUnidadDraft(u => (u ? { ...u, [c]: v } : u))}
            onGuardar={guardarUnidad}
            onCancelar={cancelarUnidad}
          />
        ) : selectedId ? (
          <MaterialForm
            material={matDraft}
            onChange={(c, v) => setMatDraft(d => (d ? { ...d, [c]: v } : d))}
            onGuardar={guardarMat}
            onCancelar={cancelarMat}
            onDuplicar={duplicarMat}
            onEliminar={onEliminar}
          />
        ) : null}
      </div>
      <div className="md:w-1/2 md:pl-4 space-y-4">
        <MaterialesTab />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UnidadesPanel material={material} onChange={() => {}} onSelect={openUnidad} />
          <AuditoriasPanel material={material} almacenId={0} onSelectHistorial={openAuditoria} />
        </div>
      </div>
    </div>
  );
}
