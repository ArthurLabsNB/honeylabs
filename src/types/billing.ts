export interface Factura {
  id?: number;
  folio?: string;
  clienteId?: number;
  fechaEmision?: string;
  total?: number;
  moneda?: string;
}

export interface FacturaItem {
  id?: number;
  facturaId?: number;
  materialId?: number;
  unidadId?: number;
  cantidad?: number;
  precio?: number;
}

export interface Transaccion {
  id?: number;
  facturaId?: number;
  fecha?: string;
  metodo?: string;
  monto?: number;
  referencia?: string;
}

export interface Ticket {
  id?: number;
  facturaId?: number;
  usuarioId?: number;
  fecha?: string;
  detalle?: string;
}
