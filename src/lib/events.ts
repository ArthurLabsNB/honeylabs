import { EventEmitter } from 'events'

// Tipos de evento emitidos por la aplicación.
// - 'usuarios_update': cambios en los usuarios de un almacén.
// - 'alertas_update': se generó o modificó una alerta.
// - 'auditoria_new': creación de una auditoría.
export type AppEvent = { type: string; payload?: any }

export const events = new EventEmitter()

export function emitEvent(event: AppEvent) {
  events.emit('event', event)
}
