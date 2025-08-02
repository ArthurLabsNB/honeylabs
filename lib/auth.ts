import { cookies as getCookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { SESSION_COOKIE } from '@lib/constants';
import { getDb } from '@lib/db';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function getUsuarioFromSession({ cookies }: { cookies?: ReturnType<typeof getCookies> } = {}) {
  const jar = cookies ?? await getCookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { id, sid } = jwt.verify(token, JWT_SECRET) as { id: number; sid?: number };
    try {
      const db = getDb().client;
      const { data: ses } = await db.from('sesion_usuario').select('id').eq('id', sid ?? -1).maybeSingle();
      if (!ses) return null;
    } catch {}
    return { id };
  } catch {
    return null;
  }
}
