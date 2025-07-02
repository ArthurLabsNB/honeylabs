'use client'
import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { CapacitorUpdater } from '@capgo/capacitor-updater'

export default function CapgoUpdater() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    const sub = CapacitorUpdater.addListener('downloadComplete', () => {
      CapacitorUpdater.reload()
    })
    return () => {
      sub.remove()
    }
  }, [])
  return null
}
