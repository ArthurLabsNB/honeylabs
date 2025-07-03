import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BasicTracerProvider, BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';

let provider: BasicTracerProvider | null = null;

export function initEdgeTracing(url: string) {
  if (provider) return;
  const exporter = new OTLPTraceExporter({ url });
  provider = new BasicTracerProvider({
    spanProcessors: [new BatchSpanProcessor(exporter)],
  });
  provider.register();
}

export function edgeTracer() {
  if (!provider) throw new Error('Edge tracing no inicializado');
  return provider.getTracer('edge');
}

