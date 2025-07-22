import type { TabType } from '@/hooks/useTabs'

export interface TabConfig {
  label: string
  defaultH: number
}

export const tabConfig: Record<TabType, TabConfig> = {
  materiales: { label: 'Materiales', defaultH: 3 },
  unidades: { label: 'Unidades', defaultH: 2 },
  auditorias: { label: 'Auditorías', defaultH: 2 },
  notas: { label: 'Notas', defaultH: 3 },
  board: { label: 'Tablero', defaultH: 3 },
  url: { label: 'URL', defaultH: 3 },
  'form-material': { label: 'Formulario Material', defaultH: 3 },
  'form-unidad': { label: 'Formulario Unidad', defaultH: 3 },
  'form-auditoria': { label: 'Formulario Auditoría', defaultH: 3 },
}

export const tabOptions: Array<{ type: TabType; label: string }> = [
  { type: 'materiales', label: tabConfig.materiales.label },
  { type: 'unidades', label: tabConfig.unidades.label },
  { type: 'auditorias', label: tabConfig.auditorias.label },
  { type: 'notas', label: tabConfig.notas.label },
  { type: 'url', label: tabConfig.url.label },
]
