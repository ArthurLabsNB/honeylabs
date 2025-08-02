// Normaliza base path removiendo cualquier '/' final para evitar
// rutas duplicadas como '/base//api/perfil'
export const BASE_PATH = (process.env.NEXT_PUBLIC_BASE_PATH ?? '').replace(/\/+$/, '');

export function apiPath(path: string): string {
  if (!path.startsWith('/')) path = '/' + path;
  return `${BASE_PATH}${path}`;
}

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const url = typeof input === 'string' ? apiPath(input) : input;
  const headers: HeadersInit = {
    ...(init.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
    ...(init.headers || {}),
  };
  return fetch(url, {
    credentials: 'include',
    cache: 'no-store',
    ...init,
    headers,
  });
}
