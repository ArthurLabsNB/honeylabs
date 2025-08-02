import { describe, it, expect, vi, afterEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { SESSION_COOKIE } from '@lib/constants';

vi.mock('@lib/db', () => ({ getDb: vi.fn() }));

process.env.JWT_SECRET = 'test-secret';

const { getDb } = await import('@lib/db');
const { getUsuarioFromSession } = await import('../lib/auth');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getUsuarioFromSession', () => {
  it('retorna datos cuando token y sesión son válidos', async () => {
    const token = jwt.sign({ id: 1, sid: 2 }, 'test-secret');
    const req = { cookies: { get: (n: string) => (n === SESSION_COOKIE ? { value: token } : undefined) } };
    const from = vi.fn((table: string) => {
      if (table === 'sesion_usuario') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({ maybeSingle: () => Promise.resolve({ data: { id: 2 } }) }),
          }),
        };
      }
      if (table === 'usuario') {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: () =>
                Promise.resolve({ data: { id: 1, nombre: 'u', correo: 'c', tipo_cuenta: 'admin', rol: 'admin', preferencias: '{}', plan: null, roles: [] } }),
            }),
          }),
        };
      }
      return { select: vi.fn().mockReturnValue({ eq: vi.fn().mockReturnValue({ maybeSingle: () => Promise.resolve({ data: null }) }) }) };
    });
    vi.mocked(getDb).mockReturnValue({ client: { from } as any });

    const res = await getUsuarioFromSession(req as any);
    expect(res).toMatchObject({ id: 1 });
    expect(from).toHaveBeenCalledWith('sesion_usuario');
    expect(from).toHaveBeenCalledWith('usuario');
  });

  it('retorna null si token es inválido', async () => {
    const req = { cookies: { get: () => ({ value: 'bad' }) } };
    const res = await getUsuarioFromSession(req as any);
    expect(res).toBeNull();
  });
});
