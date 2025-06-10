export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function apiPath(path: string): string {
  if (!path.startsWith('/')) path = '/' + path;
  return `${BASE_PATH}${path}`;
}

export function apiFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  return fetch(apiPath(path), { credentials: 'include', ...options });
}
