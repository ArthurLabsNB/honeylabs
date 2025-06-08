// Simple logger with level control
import { NextRequest } from 'next/server'

const levels = ['debug', 'info', 'warn', 'error'] as const
export type LogLevel = (typeof levels)[number]

const envLevel = process.env.LOG_LEVEL?.toLowerCase() as LogLevel | undefined
const currentLevel = envLevel && levels.includes(envLevel) ? envLevel : 'info'

function shouldLog(level: LogLevel) {
  return levels.indexOf(level) >= levels.indexOf(currentLevel)
}

function formatPrefix(req?: NextRequest) {
  const parts = [new Date().toISOString()]
  if (req) {
    parts.push(req.method)
    try {
      parts.push(new URL(req.url).pathname)
    } catch {
      parts.push(req.url)
    }
  }
  return parts.join(' ')
}

function baseLog(level: LogLevel, args: any[]) {
  if (!shouldLog(level)) return

  let req: NextRequest | undefined
  if (args[0] && typeof args[0] === 'object' && 'method' in args[0] && 'url' in args[0]) {
    req = args.shift() as NextRequest
  }

  const prefix = formatPrefix(req)
  const fn = console[level] || console.log
  fn(prefix, ...args)
}

export function debug(...args: any[]) {
  baseLog('debug', args)
}

export function info(...args: any[]) {
  baseLog('info', args)
}

export function warn(...args: any[]) {
  baseLog('warn', args)
}

export function error(...args: any[]) {
  baseLog('error', args)
}
