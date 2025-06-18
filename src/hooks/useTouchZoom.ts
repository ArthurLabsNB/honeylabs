"use client"
import { usePinch } from '@use-gesture/react'

export default function useTouchZoom(
  ref: React.RefObject<HTMLElement>,
  onZoom: (z: number) => void,
) {
  usePinch(
    ({ offset: [d] }) => {
      const scale = Math.min(3, Math.max(0.5, 1 + d / 200))
      onZoom(parseFloat(scale.toFixed(2)))
    },
    { target: ref, eventOptions: { passive: false } },
  )
}
