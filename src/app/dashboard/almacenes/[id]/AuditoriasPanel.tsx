"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

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
        <Link href="/dashboard/auditorias" className="text-sm underline">
          Ver todas
        </Link>
      </div>
      <ul className="space-y-2 max-h-96 overflow-y-auto">
        {auditorias.map((a) => (
          <li
            key={a.id}
            className={`dashboard-card space-y-1 cursor-pointer transition-transform hover:scale-[1.02] ${
              activo === a.id ? 'border-[var(--dashboard-accent)]' : 'hover:border-[var(--dashboard-accent)]'
            }`}
            onClick={() => {
              setActivo(a.id);
              const from = encodeURIComponent(location.pathname);
              router.push(`/dashboard/auditorias/${a.id}?from=${from}`);
              onSelectHistorial && onSelectHistorial(a);
            }}
          >
            <div className="flex justify-between items-start gap-2">
              <div className="flex items-center gap-2">
                <span className={`rounded p-1 text-white ${COLORS[a.categoria || a.tipo] || 'bg-gray-600'}`}>{ICONS[a.categoria || a.tipo] || <File className="w-4 h-4" />}</span>
                <span className="font-medium">{a.almacen?.nombre || a.material?.nombre || a.unidad?.nombre || '-'}</span>
              </div>
              <button
                className="p-1 hover:bg-white/10 rounded"
                onClick={(e) => { e.stopPropagation(); setActivo(activo === a.id ? null : a.id); }}
              >
                {activo === a.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-xs mt-1">
              <span className="mr-2 font-semibold">{a.categoria || a.tipo}</span>
              {a.version != null && <span className="mr-2">v{a.version}</span>}
              <span>{new Date(a.fecha).toLocaleString()}</span>
            </div>
            {a.observaciones && <p className="text-xs text-[var(--dashboard-muted)]">{a.observaciones}</p>}
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
