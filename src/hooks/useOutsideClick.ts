import { useEffect } from 'react'

export default function useOutsideClick<T extends HTMLElement>(
  ref: React.RefObject<T>,
  onClickOutside: () => void,
) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = ref.current
      if (!el || el.contains(e.target as Node)) return
      onClickOutside()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [ref, onClickOutside])
}

