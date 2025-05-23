import { NextRequest, NextResponse } from 'next/server';

// 🧠 Memoria local simple para almacenar intentos por IP (solo útil mientras el servidor vive)
// En producción, usar Redis, KV o Edge Store persistente
const ipRequests = new Map<string, { count: number; lastRequest: number }>();

// ⚙️ Configuración de rate limit
const RATE_LIMIT_MAX = 5; // Máximo intentos
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // Cada 1 minuto

export function middleware(req: NextRequest) {
  // ✅ Extrae IP compatible con Vercel Edge
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'desconocido';

  const now = Date.now();
  const key = `REG_${ip}`;
  const entry = ipRequests.get(key);

  if (entry) {
    if (now - entry.lastRequest < RATE_LIMIT_WINDOW_MS) {
      if (entry.count >= RATE_LIMIT_MAX) {
        console.warn(`[RATE LIMIT] IP bloqueada temporalmente: ${ip}`);
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

// 🌐 Aplica este middleware solo a /api/registro
export const config = {
  matcher: ['/api/registro'],
};
