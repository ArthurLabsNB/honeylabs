import { NextResponse } from "next/server";

export async function GET() {
  const plantillas = [
    { id: 1, nombre: "Solicitud básica" },
    { id: 2, nombre: "Reporte de incidente" },
  ];
  return NextResponse.json({ plantillas });
}
