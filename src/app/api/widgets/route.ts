import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET() {
  try {
    const widgetsDir = path.join(process.cwd(), "src/app/dashboard/components/widgets");
    const files = fs.readdirSync(widgetsDir);

    const widgets = files
      .filter((f) => f.endsWith("Widget.tsx") || f.endsWith("Widget.jsx"))
      .map((filename) => {
        const rawName = filename.replace(/\.tsx|\.jsx/, "");
        const key = rawName.replace("Widget", "").toLowerCase();
        const title = rawName.replace("Widget", "");

        return {
          key,
          title,
          file: rawName, // solo el nombre sin "./" para usar en dynamic()
          category: "General",
          w: 2,
          h: 2,
          minW: 2,
          minH: 2,
          plans: ["Free", "Pro", "Empresarial", "Institucional"],
        };
      });

    return NextResponse.json({ widgets });
  } catch (err: any) {
    console.error("❌ Error leyendo widgets:", err);
    return new NextResponse("Error al leer los widgets", { status: 500 });
  }
}
