import { useState, useCallback, useRef } from 'react'
import type { Layout } from 'react-grid-layout'

export type LayoutItem = Layout & { z?: number; locked?: boolean; owner?: string }

export interface Snapshot {
  widgets: string[]
  layout: LayoutItem[]
}

export default function useUndoRedo(initial: Snapshot) {
  const [history, setHistory] = useState<Snapshot[]>([initial])
  const [index, setIndex] = useState(0)
  const skip = useRef(false)

  const record = useCallback((snap: Snapshot) => {
    if (skip.current) {
      skip.current = false
      return
    }
    setHistory(h => [...h.slice(0, index + 1), snap])
    setIndex(i => i + 1)
  }, [index])

  const undo = useCallback(() => {
    if (index <= 0) return history[0]
    skip.current = true
    setIndex(i => i - 1)
    return history[index - 1]
  }, [index, history])

  const redo = useCallback(() => {
    if (index >= history.length - 1) return history[index]
    skip.current = true
    setIndex(i => i + 1)
    return history[index + 1]
  }, [index, history])

  const reset = useCallback((snap: Snapshot) => {
    setHistory([snap])
    setIndex(0)
  }, [])

  return { history, index, record, undo, redo, reset, skip }
}
