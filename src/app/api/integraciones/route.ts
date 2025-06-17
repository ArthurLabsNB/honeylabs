import { NextRequest, NextResponse } from "next/server";

const store: Record<string, string> = (globalThis as any).integracionesStore ||= {};

export async function GET() {
  return NextResponse.json({ integraciones: store });
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    Object.assign(store, data);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
