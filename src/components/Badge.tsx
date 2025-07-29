import { ReactNode } from 'react'

export default function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="px-1 py-0.5 rounded border border-white/20 bg-white/10 text-xs">
      {children}
    </span>
  )
}
