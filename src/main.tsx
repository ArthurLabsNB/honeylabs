import { CapacitorUpdater as Updater } from '@capgo/capacitor-updater'

Updater.addListener('downloadComplete', () => {
  Updater.reload()
})

// Verificamos actualizaciones OTA al iniciar la app
Updater.check().catch(() => {})
