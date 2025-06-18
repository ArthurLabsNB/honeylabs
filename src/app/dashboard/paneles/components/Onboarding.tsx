"use client"
import { useState, useEffect } from 'react'

const steps = [
  { target: '#panel-area', content: 'Arrastra tus widgets en esta área.' },
  { target: '#subboard-select', content: 'Cambia de sección con este menú.' },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem('panel-onboarding')) return
    setStep(1)
  }, [])
  const next = () => {
    if (step >= steps.length) {
      setStep(0)
      localStorage.setItem('panel-onboarding', 'done')
    } else {
      setStep(step + 1)
    }
  }
  if (!step) return null
  const { target, content } = steps[step - 1]
  const el = document.querySelector(target) as HTMLElement | null
  const rect = el?.getBoundingClientRect()
  return (
    <div className="fixed inset-0 z-50 pointer-events-none" onClick={next}>
      {rect && (
        <div
          style={{ position: 'absolute', top: rect.top, left: rect.left, width: rect.width, height: rect.height, border: '2px solid red' }}
        />
      )}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded pointer-events-auto">
        {content}
        <div className="text-xs mt-1">Click para continuar</div>
      </div>
    </div>
  )
}
