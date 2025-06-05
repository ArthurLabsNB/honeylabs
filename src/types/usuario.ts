export interface Usuario {
  id?: number;
  nombre?: string;
  correo?: string;
  email?: string;
  tipoCuenta?: string;
  rol?: string;
  plan?: { nombre?: string };
  avatarUrl?: string | null;
  imagen?: string | null;
  tiene2FA?: boolean;
}
