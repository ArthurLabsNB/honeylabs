import { NextResponse } from "next/server";
import widgets from "@lib/widgets.json";
import * as logger from '@lib/logger'

export async function GET() {
  try {
    return NextResponse.json({ widgets });
  } catch (err: any) {
    logger.error("❌ Error leyendo widgets:", err);
    return new NextResponse("Error al leer los widgets", { status: 500 });
  }
}
