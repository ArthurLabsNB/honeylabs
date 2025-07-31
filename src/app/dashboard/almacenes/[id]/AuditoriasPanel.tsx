"use client";
import { useState } from "react";
import Badge from '@/components/Badge'
import { parseObservaciones } from '@/lib/parseObservaciones'

import {
  File,
  PlusCircle,
  Trash2,
  Edit,
  Download,
  Upload,
  Copy,
  RefreshCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useAuditorias from "@/hooks/useAuditorias";
import useAuditoriasUpdates from "@/hooks/useAuditoriasUpdates";

interface Props {
  material: { dbId: number; nombre: string } | null;
  almacenId?: number;
  unidadId?: number;
  onSelectHistorial?: (entry: any) => void;
}

export default function AuditoriasPanel({ material, almacenId, unidadId, onSelectHistorial }: Props) {
  const tipo = material ? 'material' : unidadId ? 'unidad' : 'almacen'
  const opts: any = { tipo }
  if (tipo === 'material') opts.materialId = material?.dbId
  else if (tipo === 'unidad') opts.unidadId = unidadId
  else opts.almacenId = almacenId
  const { auditorias, mutate } = useAuditorias(opts)
  useAuditoriasUpdates(mutate)
  const [activo, setActivo] = useState<number | null>(null);

  const COLORS: Record<string, string> = {
    creacion: 'bg-green-600',
    eliminacion: 'bg-red-600',
    modificacion: 'bg-yellow-600',
    entrada: 'bg-blue-600',
    salida: 'bg-purple-600',
    exportacion: 'bg-indigo-600',
    importacion: 'bg-teal-600',
    actualizacion: 'bg-orange-600',
    duplicacion: 'bg-pink-600',
  }
  const ICONS: Record<string, JSX.Element> = {
    creacion: <PlusCircle className="w-4 h-4" />,
    eliminacion: <Trash2 className="w-4 h-4" />,
    modificacion: <Edit className="w-4 h-4" />,
    entrada: <Download className="w-4 h-4" />,
    salida: <Upload className="w-4 h-4" />,
    exportacion: <Upload className="w-4 h-4" />,
    importacion: <Download className="w-4 h-4" />,
    actualizacion: <RefreshCcw className="w-4 h-4" />,
    duplicacion: <Copy className="w-4 h-4" />,
  }

  return (
    <div className="p-4 border rounded-md space-y-2 mt-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Auditorías</h2>
      </div>
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {auditorias.map((a) => (
          <li
            key={a.id}
            className={`dashboard-card space-y-2 cursor-pointer transition-transform hover:scale-[1.02] ${
              activo === a.id ? 'border-[var(--dashboard-accent)]' : 'hover:border-[var(--dashboard-accent)]'
            }`}
            onClick={() => {
              setActivo(a.id);
              onSelectHistorial && onSelectHistorial(a);
            }}
          >
            <div className="relative">
              <h3 className="font-medium text-center">
                {a.almacen?.nombre || a.material?.nombre || a.unidad?.nombre || '-'}
              </h3>
              <button
                className="absolute top-0 right-0 p-1 hover:bg-white/10 rounded"
                onClick={(e) => {
                  e.stopPropagation();
                  setActivo(activo === a.id ? null : a.id);
                }}
              >
                {activo === a.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span>{new Date(a.fecha).toLocaleString()}</span>
              <span className={`px-2 py-0.5 rounded text-white ${COLORS[a.categoria || a.tipo] || 'bg-gray-600'}`}>
                {a.categoria || a.tipo}
              </span>
            </div>
            <div className="text-xs space-y-0.5">
              <div>
                <span className="font-semibold mr-1">ID:</span>
                {a.id}
              </div>
              {a.observaciones && (
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-semibold mr-1">Motivo:</span>
                  {a.categoria === 'modificacion'
                    ? (() => {
                        const obj = parseObservaciones(a.observaciones)
                        return obj
                          ? Object.keys(obj).map((k) => (
                              <Badge key={k}>{k}</Badge>
                            ))
                          : a.observaciones
                      })()
                    : a.observaciones}
                </div>
              )}
              {a.usuario?.nombre && (
                <div>
                  <span className="font-semibold mr-1">Autor:</span>
                  {a.usuario.nombre}
                </div>
              )}
              <div>
                <span className="font-semibold mr-1">Tipo:</span>
                {a.tipo}
              </div>
            </div>
            {activo === a.id && (
              <div className="mt-2 space-y-1 text-xs">
                {a.archivos?.map((f: any) => (
                  <a
                    key={f.id}
                    href={`/api/auditorias/${a.id}/archivos/${f.id}`}
                    className="flex justify-between items-center border rounded p-1 hover:bg-white/5"
                    download
                  >
                    <span className="truncate flex-1 mr-2">{f.nombre}</span>
                    <Download className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </li>
        ))}
        {auditorias.length === 0 && (
          <li className="text-sm text-zinc-500">Sin registros</li>
        )}
      </ul>
    </div>
  );
}
