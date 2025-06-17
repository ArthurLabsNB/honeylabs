import { NextRequest, NextResponse } from "next/server";
interface Plantilla { id: number; nombre: string; tipo: string }

const store: Plantilla[] = (globalThis as any).plantillasStore ||= [
  { id: 1, nombre: "Solicitud básica", tipo: "publica" },
  { id: 2, nombre: "Reporte de incidente", tipo: "publica" },
];

export async function GET() {
  return NextResponse.json({ plantillas: store });
}

export async function POST(req: NextRequest) {
  try {
    const { nombre, tipo } = await req.json();
    const plantilla = { id: Date.now(), nombre, tipo: tipo || "privada" } as Plantilla;
    store.push(plantilla);
    return NextResponse.json({ plantilla });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
