import { CapacitorUpdater as Updater } from '@capgo/capacitor-updater'

Updater.addListener('downloadComplete', () => {
  Updater.reload()
})

// Verificamos actualizaciones OTA al iniciar la ap
Updater.check().catch(() => {})
