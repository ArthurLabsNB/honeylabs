import { EventEmitter } from 'events'

export type AppEvent = { type: string; payload?: any }

export const events = new EventEmitter()

export function emitEvent(event: AppEvent) {
  events.emit('event', event)
}
