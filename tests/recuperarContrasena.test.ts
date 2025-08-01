import { describe, it, expect, vi, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { prisma } from '@lib/db/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

process.env.JWT_SECRET = 'secret';

const { POST: solicitar } = await import('../src/app/api/recuperar-contrasena/route');
const { POST: restablecer } = await import('../src/app/api/recuperar-contrasena/[token]/route');

afterEach(() => vi.restoreAllMocks());

describe('recuperar contrasena', () => {
  it('requiere correo', async () => {
    const req = new NextRequest('http://localhost/api/recuperar-contrasena', { method: 'POST', body: '{}' });
    const res = await solicitar(req);
    expect(res.status).toBe(400);
  });

  it('restablece con token valido', async () => {
    vi.spyOn(prisma.usuario, 'findUnique').mockResolvedValue({ id: 1, nombre: 'Test', correo: 't@example.com' } as any);
    const update = vi.spyOn(prisma.usuario, 'update').mockResolvedValue({} as any);
    vi.spyOn(bcrypt, 'hash').mockResolvedValue('nuevo' as any);
    const token = jwt.sign({ id: 1, tipo: 'reset' }, 'secret');
    const req = new NextRequest(`http://localhost/api/recuperar-contrasena/${token}`, {
      method: 'POST',
      body: JSON.stringify({ contrasena: '123456' }),
    });
    const res = await restablecer(req);
    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalled();
  });
});
