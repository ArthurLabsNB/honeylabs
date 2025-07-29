import { describe, it, expect, vi, afterEach } from 'vitest'
import { startAuditoriasUpdates } from '../src/hooks/useAuditoriasUpdates'

class MockES {
  static instances: MockES[] = []
  onmessage?: (e: { data: string }) => void
  constructor(public url: string) { MockES.instances.push(this) }
  addEventListener() {}
  close() {}
}

afterEach(() => {
  vi.restoreAllMocks()
  MockES.instances = []
})

describe('auditorias updates', () => {
  it('invoca mutate cuando llega auditoria_new', () => {
    // @ts-ignore
    global.EventSource = MockES
    const mutate = vi.fn()
    startAuditoriasUpdates(mutate)
    const msg = JSON.stringify({ type: 'auditoria_new', payload: { id: 1 } })
    MockES.instances[0].onmessage?.({ data: msg } as any)
    expect(mutate).toHaveBeenCalled()
  })

  it('ignora otros eventos', () => {
    // @ts-ignore
    global.EventSource = MockES
    const mutate = vi.fn()
    startAuditoriasUpdates(mutate)
    const msg = JSON.stringify({ type: 'otro' })
    MockES.instances[0].onmessage?.({ data: msg } as any)
    expect(mutate).not.toHaveBeenCalled()
  })
})
