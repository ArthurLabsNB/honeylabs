import { NextResponse } from "next/server";
import { getWidgets } from "@lib/widgets";
import * as logger from '@lib/logger'

export async function GET() {
  try {
    const widgets = await getWidgets()
    return NextResponse.json({ widgets });
  } catch (err: any) {
    logger.error("❌ Error leyendo widgets:", err);
    return new NextResponse("Error al leer los widgets", { status: 500 });
  }
}
