import { NextResponse } from "next/server";

export async function GET() {
  const invoices = [
    { id: 1, concepto: "Suscripción Pro", monto: 19.99, estado: "pagado" },
    { id: 2, concepto: "Suscripción Pro", monto: 19.99, estado: "pendiente" },
  ];
  return NextResponse.json({ invoices });
}
