// lib/tracing.ts
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'

let initialized = (globalThis as any).__OTEL_INIT__ === true

export async function setupTracing() {
  if (initialized || typeof window === 'undefined') return
  if (process.env.NEXT_PUBLIC_TRACING !== '1') return

  const raw = (process.env.NEXT_PUBLIC_OTEL_EXPORTER_URL || '').trim()
  if (!raw) return
  const exporterUrl = raw.replace(/\/$/, '') // ej: http://localhost:4318/v1/traces

  const { WebTracerProvider } = await import('@opentelemetry/sdk-trace-web')
  const { BatchSpanProcessor } = await import('@opentelemetry/sdk-trace-base')

  const provider = new WebTracerProvider()
  provider.addSpanProcessor(new BatchSpanProcessor(new OTLPTraceExporter({ url: exporterUrl })))
  provider.register()

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        ignoreUrls: [exporterUrl, /\/v1\/traces$/],
        propagateTraceHeaderCorsUrls: [/^https?:\/\/localhost(:\d+)?/],
      }),
    ],
  })

  initialized = true
  ;(globalThis as any).__OTEL_INIT__ = true
}
