import { describe, it, expect, vi, afterEach } from 'vitest'
import { startBuildProgress } from '../src/hooks/useBuildProgress'

class MockES {
  static instances: MockES[] = []
  onerror?: () => void
  constructor(public url: string) { MockES.instances.push(this) }
  addEventListener() {}
  close() {}
}

afterEach(() => {
  vi.restoreAllMocks()
  MockES.instances = []
})

describe('build progress reconnect', () => {
  it('retries connection on error', async () => {
    // @ts-ignore
    global.EventSource = MockES
    const onData = vi.fn()
    vi.useFakeTimers()
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue(new Response('', { status: 200 }))
    const stop = startBuildProgress(onData)
    expect(MockES.instances.length).toBe(1)
    MockES.instances[0].onerror && MockES.instances[0].onerror()
    await Promise.resolve()
    vi.advanceTimersByTime(1000)
    expect(MockES.instances.length).toBe(2)
    stop()
    vi.useRealTimers()
  })

  it('stops reconnecting when unauthorized', async () => {
    // @ts-ignore
    global.EventSource = MockES
    // @ts-ignore
    global.fetch = vi.fn().mockResolvedValue(new Response('', { status: 401 }))
    vi.useFakeTimers()
    const stop = startBuildProgress(() => {})
    expect(MockES.instances.length).toBe(1)
    MockES.instances[0].onerror && MockES.instances[0].onerror()
    await Promise.resolve()
    vi.advanceTimersByTime(1000)
    expect(MockES.instances.length).toBe(1)
    stop()
    vi.useRealTimers()
  })
})
