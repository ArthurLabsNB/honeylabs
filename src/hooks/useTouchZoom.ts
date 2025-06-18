"use client"
import { useEffect } from 'react'
import { usePinch } from '@use-gesture/react'

export default function useTouchZoom(ref: React.RefObject<HTMLElement>, onZoom: (z: number) => void) {
  useEffect(() => {
    if (!ref.current) return
    const bind = usePinch(({ offset: [d] }) => {
      const scale = Math.min(3, Math.max(0.5, 1 + d / 200))
      onZoom(parseFloat(scale.toFixed(2)))
    }, { target: ref.current, eventOptions: { passive: false } })
    return () => { bind?.() }
  }, [ref, onZoom])
}
