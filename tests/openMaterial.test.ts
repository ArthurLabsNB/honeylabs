import { describe, it, expect } from 'vitest'
import { openMaterial } from '../src/app/dashboard/almacenes/utils/openMaterial'
import type { TabType } from '../src/hooks/useTabs'

function createOpts() {
  let sel: string | null = null
  const tabs: { type: TabType }[] = []
  return {
    opts: {
      setSelectedId: (id: string) => { sel = id },
      setUnidadSel: () => {},
      ensureTab: (type: TabType) => { tabs.push({ type }) },
      openForm: () => {},
    },
    get selected() { return sel },
    get tabs() { return tabs },
  }
}

describe('openMaterial', () => {
  it('actualiza selectedId y prepara tarjetas', () => {
    const ctx = createOpts()
    openMaterial('m1', ctx.opts)
    expect(ctx.selected).toBe('m1')
    expect(ctx.tabs.some(t => t.type === 'unidades')).toBe(true)
  })
})
