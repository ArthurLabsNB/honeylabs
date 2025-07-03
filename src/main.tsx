import { CapacitorUpdater as Updater } from '@capgo/capacitor-updater'

Updater.addListener('downloadComplete', () => {
  Updater.reload()
})
