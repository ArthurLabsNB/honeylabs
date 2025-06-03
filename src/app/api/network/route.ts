import { NextResponse } from "next/server";

export async function GET() {
  const peers = [
    { id: 1, nombre: "Lab Central" },
    { id: 2, nombre: "Depósito Norte" },
  ];
  return NextResponse.json({ peers });
}
