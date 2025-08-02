import { describe, it, expect, vi, afterAll } from 'vitest'
import * as logger from '@lib/logger'
import { restoreConsoleError } from '../src/client/components/globals/intercept-console-error'

describe('interceptor de console.error', () => {
  afterAll(() => {
    restoreConsoleError()
  })

  it('no duplica registros al interceptar', () => {
    const spy = vi.spyOn(logger, 'error')
    console.error('fallo')
    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })
})
