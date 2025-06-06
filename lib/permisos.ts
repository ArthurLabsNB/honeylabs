export function getMainRole(u: { rol?: string; roles?: { nombre?: string }[] } | null | undefined): string | undefined {
  if (!u) return undefined;
  if (u.rol) return String(u.rol);
  if (u.roles && u.roles.length > 0 && u.roles[0]?.nombre) return String(u.roles[0].nombre);
  return undefined;
}

export function normalizeTipoCuenta(tipo?: string): string {
  const t = (tipo ?? '').toLowerCase();
  if (t === 'administrador') return 'admin';
  if (t === 'estandar' || t === 'standard') return 'individual';
  return t || 'individual';
}

export function hasManagePerms(
  u: {
    rol?: string;
    roles?: { nombre?: string }[];
    tipoCuenta?: string;
    plan?: { nombre?: string };
    esSuperAdmin?: boolean;
  } | null | undefined,
): boolean {
  if (u?.esSuperAdmin) return true;
  const rol = getMainRole(u)?.toLowerCase();
  const tipo = normalizeTipoCuenta(u?.tipoCuenta);
  const plan = (u?.plan?.nombre ?? '').toLowerCase();
  if (rol === 'admin' || rol === 'administrador') return true;
  if (['institucional', 'empresarial'].includes(tipo)) return true;
  if (['empresarial', 'institucional', 'pro'].includes(plan)) return true;
  return false;
}
