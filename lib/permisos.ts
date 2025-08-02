export function normalizeRol(rol?: string): string {
  return (rol ?? '').trim().toLowerCase()
}

export function getMainRole(
  u: { rol?: string; roles?: { nombre?: string }[] } | null | undefined,
): string | { nombre?: string } | undefined {
  if (!u) return undefined
  if (u.rol) return u.rol
  if (u.roles && u.roles.length > 0) return u.roles[0]
  return undefined
}

export function normalizeTipoCuenta(tipo?: string): string {
  const t = (tipo ?? '').toLowerCase();
  if (t === 'administrador') return 'admin';
  if (t === 'estandar' || t === 'standard') return 'individual';
  return t || 'individual';
}

export function isAdminUser(u: {
  rol?: string;
  roles?: { nombre?: string }[];
  tipoCuenta?: string;
} | null | undefined): boolean {
  const _role = getMainRole(u)
  const rol = normalizeRol(
    typeof _role === 'string' ? _role : _role?.nombre,
  )
  const tipo = normalizeTipoCuenta(u?.tipoCuenta)
  return rol === 'admin' || rol === 'administrador' || tipo === 'admin'
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
  if (!u) return false;
  if (u.esSuperAdmin) return true;

  const _role = getMainRole(u)
  const rol = normalizeRol(
    typeof _role === 'string' ? _role : _role?.nombre,
  )
  if (rol === 'admin' || rol === 'administrador') return true;

  const tipo = normalizeTipoCuenta(u.tipoCuenta);
  if (tipo !== 'codigo') return true;

  const plan = (u.plan?.nombre ?? '').toLowerCase();
  if (['empresarial', 'institucional', 'pro'].includes(plan)) return true;

  return false;
}

export function hasPermission(
  u: { roles?: { permisos?: Record<string, any> }[] } | null | undefined,
  permiso: string,
): boolean {
  if (!u) return false
  for (const r of u.roles || []) {
    if (r.permisos && (r.permisos as any)[permiso]) return true
  }
  return false
}
