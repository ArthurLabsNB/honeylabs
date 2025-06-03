import { NextResponse } from "next/server";

export async function GET() {
  const stats = { usuarios: 120, almacenes: 5 };
  return NextResponse.json({ stats });
}
