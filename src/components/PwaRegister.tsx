'use client'
import { useEffect } from 'react'

export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      void import('next-pwa/register')
    }
  }, [])
  return null
}
