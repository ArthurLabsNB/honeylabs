import { NextRequest, NextResponse } from 'next/server';

// 🚨 Memoria temporal (solo para desarrollo/servidor vivo)
const ipRequests = new Map<string, { count: number; lastRequest: number }>();

// ⚙️ Configuración
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

export function middleware(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'desconocido';

  const path = req.nextUrl.pathname;
  const key = `RATE_REGISTRO_${ip}`;

  const now = Date.now();
  const entry = ipRequests.get(key);

  if (entry) {
    if (now - entry.lastRequest < RATE_LIMIT_WINDOW_MS) {
      if (entry.count >= RATE_LIMIT_MAX) {
        console.warn(`[RATE LIMIT] Bloqueada: ${ip} en ${path}`);
        return new NextResponse(
          JSON.stringify({ error: 'Demasiadas peticiones. Intenta más tarde.' }),
          {
            status: 429,
            headers: {
              'Content-Type': 'application/json',
              'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
            },
          }
        );
      } else {
        entry.count += 1;
        entry.lastRequest = now;
        ipRequests.set(key, entry);
      }
    } else {
      ipRequests.set(key, { count: 1, lastRequest: now });
    }
  } else {
    ipRequests.set(key, { count: 1, lastRequest: now });
  }

  return NextResponse.next();
}

// 🛡️ Solo aplicar a estas rutas por ahora
export const config = {
  matcher: ['/api/registro', '/api/login'],
};
