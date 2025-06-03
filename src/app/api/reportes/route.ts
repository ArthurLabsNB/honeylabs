import { NextResponse } from "next/server";

export async function GET() {
  const reportes = [
    { id: 1, titulo: "Inventario mensual" },
    { id: 2, titulo: "Incidencias" },
  ];
  return NextResponse.json({ reportes });
}
