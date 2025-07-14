import { useState, useEffect } from 'react'

export default function useElementSize<T extends HTMLElement>(
  ref: React.RefObject<T>,
) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect
      if (rect) setSize({ width: rect.width, height: rect.height })
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref])

  return size
}
