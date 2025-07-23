'use client'
import { useEffect } from 'react'

export default function PwaRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === 'production' ||
      process.env.NEXT_PUBLIC_ENABLE_PWA === 'true'
    ) {
      void import('next-pwa/register')
    }
  }, [])
  return null
}
