import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';

// La inicialización sólo debe ocurrir en el navegador

let initialized = false;

export async function setupTracing() {
  if (initialized || typeof window === 'undefined') return;
  const { WebTracerProvider, BatchSpanProcessor } = await import('@opentelemetry/sdk-trace-web');
  const exporter = new OTLPTraceExporter({ url: process.env.NEXT_PUBLIC_OTEL_EXPORTER_URL });
  const provider = new WebTracerProvider();
  provider.addSpanProcessor(new BatchSpanProcessor(exporter));
  provider.register();
  registerInstrumentations({ instrumentations: [new FetchInstrumentation()] });
  initialized = true;
}
