"use client";
import useSWR from "swr";
import fetcher from "@lib/swrFetcher";

interface Props {
  auditoriaId: number | null;
  onClose: () => void;
}

export default function AuditoriaForm({ auditoriaId, onClose }: Props) {
  const { data } = useSWR(auditoriaId ? `/api/auditorias/${auditoriaId}` : null, fetcher);
  const auditoria = data?.auditoria;

  if (!auditoriaId) return <p className="text-sm p-2">Selecciona una auditoría.</p>;
  if (!auditoria) return <p className="text-sm p-2">Cargando...</p>;

  const restore = async () => {
    if (!auditoriaId) return;
    try {
      await fetch(`/api/auditorias/${auditoriaId}/restore`, { method: 'POST' });
    } catch {}
  };

  return (
    <div className="space-y-2 text-sm p-2 overflow-y-auto max-h-[calc(100vh-8rem)]">
      <div>Tipo: {auditoria.tipo}</div>
      <div>Versión: {auditoria.version}</div>
      {auditoria.categoria && <div>Categoría: {auditoria.categoria}</div>}
      {auditoria.almacen?.nombre && <div>Almacén: {auditoria.almacen.nombre}</div>}
      {auditoria.material?.nombre && <div>Material: {auditoria.material.nombre}</div>}
      {auditoria.unidad?.nombre && <div>Unidad: {auditoria.unidad.nombre}</div>}
      {auditoria.observaciones && <div>{auditoria.observaciones}</div>}
      {auditoria.usuario?.nombre && <div>Usuario: {auditoria.usuario.nombre}</div>}
      <div>{new Date(auditoria.fecha).toLocaleString()}</div>
      <button
        onClick={restore}
        className="no-drag px-2 py-1 rounded bg-white/10 text-xs"
      >
        Restaurar
      </button>
      <button onClick={onClose} className="no-drag px-2 py-1 rounded bg-white/10 text-xs">
        Cerrar
      </button>
    </div>
  );
}

