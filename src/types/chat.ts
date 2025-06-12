export interface CanalChat {
  id: number;
  nombre: string;
}

export interface MensajeChat {
  id: number;
  texto: string | null;
  archivo: string | null;
  anclado: boolean;
  fecha: string;
  usuario: {
    id: number;
    nombre?: string | null;
  };
}
