import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

let initialized = false;

export function setupTracing() {
  if (initialized || typeof window === 'undefined') return;
  const exporter = new OTLPTraceExporter({ url: process.env.NEXT_PUBLIC_OTEL_EXPORTER_URL });
  const provider = new WebTracerProvider();
  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
  provider.register();
  registerInstrumentations({ instrumentations: [new FetchInstrumentation()] });
  initialized = true;
}
