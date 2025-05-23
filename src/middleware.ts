import { NextRequest, NextResponse } from 'next/server'

// 🧠 Memoria local simple para almacenar intentos (para producción se recomienda Redis u otro store)
const ipRequests = new Map<string, { count: number, lastRequest: number }>();

// ⚙️ Configuración
const RATE_LIMIT_MAX = 5; // máximo intentos
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // cada 1 minuto

export function middleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'desconocido';

  const now = Date.now();
  const key = `REG_${ip}`;
  const entry = ipRequests.get(key);

  if (entry) {
    if (now - entry.lastRequest < RATE_LIMIT_WINDOW_MS) {
      if (entry.count >= RATE_LIMIT_MAX) {
        console.warn(`[RATE LIMIT] IP bloqueada temporalmente: ${ip}`);
        return new NextResponse(
          JSON.stringify({ error: 'Demasiadas peticiones. Intenta más tarde.' }),
          { status: 429, headers: { 'Content-Type': 'application/json' } }
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

// 🌐 Aplica este middleware SOLO a rutas API que empiecen con /api/registro
export const config = {
  matcher: ['/api/registro'],
};
