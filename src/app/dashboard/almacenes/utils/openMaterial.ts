import type { TabType } from '@/hooks/useTabs'

export interface OpenMaterialOptions {
  setSelectedId: (id: string) => void
  setUnidadSel: (u: any) => void
  ensureTab: (type: TabType, title: string, side: 'left' | 'right') => void
  openForm: (type: 'form-material' | 'form-unidad', title: string) => void
}

export function openMaterial(id: string | null, opts: OpenMaterialOptions) {
  if (!id) return
  opts.setSelectedId(id)
  opts.setUnidadSel(null)
  opts.ensureTab('unidades', 'Unidades', 'right')
  opts.openForm('form-material', 'Material')
}
