import { NextRequest, NextResponse } from 'next/server';

// --- Memory Rate Limiter ---
// Solo para desarrollo, VPS o entornos con estado.
// Para serverless: migrar a Redis/Upstash/DynamoDB, etc.
const limiterMemory = new Map<string, { count: number; lastRequest: number }>();

const RATE_LIMIT_MAX = 65;                 // Máximo por ventana
const RATE_LIMIT_WINDOW_MS = 60 * 1000;   // 1 minuto

// Limpieza periódica para liberar memoria
function limpiarRegistrosViejos() {
  const now = Date.now();
  for (const [key, value] of limiterMemory.entries()) {
    if (now - value.lastRequest > RATE_LIMIT_WINDOW_MS * 2) {
      limiterMemory.delete(key);
    }
  }
}
if (typeof global !== "undefined") {
  setInterval(limpiarRegistrosViejos, RATE_LIMIT_WINDOW_MS);
}

/**
 * Obtiene una clave única para el limitador:
 * - Si hay cookie de sesión/token, la usa.
 * - Si no, toma la IP del request.
 * - En local, usa un ID random para evitar bloqueo global.
 */
function getRateLimitKey(req: NextRequest): string {
  const sessionCookie =
    req.cookies.get('token')?.value ||
    req.cookies.get('sessionid')?.value;

  if (sessionCookie) return `SESSION_${sessionCookie}`;

  let ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    null;

  if (!ip || ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') {
    ip = `local_${Math.random().toString(36).slice(2, 10)}`;
  }

  return `IP_${ip}`;
}

export function middleware(req: NextRequest) {
  const key = getRateLimitKey(req);
  const path = req.nextUrl.pathname;
  const now = Date.now();

  const entry = limiterMemory.get(key);

  // Rate limit: bloquea si excede el máximo en la ventana
  if (entry && now - entry.lastRequest < RATE_LIMIT_WINDOW_MS) {
    if (entry.count >= RATE_LIMIT_MAX) {
      console.warn(`[RATE LIMIT] Bloqueado: ${key} en ${path} (${entry.count} reqs/min)`);
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
    }
    entry.count += 1;
    entry.lastRequest = now;
    limiterMemory.set(key, entry);
  } else {
    // Nueva ventana de rate limit para la clave
    limiterMemory.set(key, { count: 1, lastRequest: now });
  }

  return NextResponse.next();
}

// Aplica SOLO a login y registro (puedes agregar más rutas aquí si quieres)
export const config = {
  matcher: ['/api/registro', '/api/login'],
};
