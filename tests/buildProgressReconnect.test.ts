import { describe, it, expect, vi } from 'vitest'
import { startBuildProgress } from '../src/hooks/useBuildProgress'

class MockES {
  static instances: MockES[] = []
  onerror?: () => void
  constructor(public url: string) { MockES.instances.push(this) }
  addEventListener() {}
  close() {}
}

describe('build progress reconnect', () => {
  it('retries connection on error', () => {
    // @ts-ignore
    global.EventSource = MockES
    const onData = vi.fn()
    vi.useFakeTimers()
    const stop = startBuildProgress(onData)
    expect(MockES.instances.length).toBe(1)
    MockES.instances[0].onerror && MockES.instances[0].onerror()
    vi.advanceTimersByTime(1000)
    expect(MockES.instances.length).toBe(2)
    stop()
    vi.useRealTimers()
  })
})
