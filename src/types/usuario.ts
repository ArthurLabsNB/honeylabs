export interface Usuario {
  id?: number;
  nombre?: string;
  correo?: string;
  email?: string;
  tipoCuenta?: string;
  rol?: string;
  roles?: { id?: number; nombre?: string; descripcion?: string; permisos?: Record<string, any> }[];
  plan?: { nombre?: string; limites?: Record<string, any>; fechaFin?: string };
  avatarUrl?: string | null;
  imagen?: string | null;
  tiene2FA?: boolean;
  esSuperAdmin?: boolean;
}
