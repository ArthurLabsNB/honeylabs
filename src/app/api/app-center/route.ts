import { NextResponse } from "next/server";

export async function GET() {
  const apps = [
    { id: 1, nombre: "Inventario" },
    { id: 2, nombre: "Préstamos" },
  ];
  return NextResponse.json({ apps });
}
