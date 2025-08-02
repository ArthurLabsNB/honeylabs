-- DropForeignKey
ALTER TABLE "ArchivoAuditoria" DROP CONSTRAINT "ArchivoAuditoria_auditoriaId_fkey";

-- DropForeignKey
ALTER TABLE "ArchivoReporte" DROP CONSTRAINT "ArchivoReporte_reporteId_fkey";

-- AddForeignKey
ALTER TABLE "ArchivoReporte" ADD CONSTRAINT "ArchivoReporte_reporteId_fkey" FOREIGN KEY ("reporteId") REFERENCES "Reporte"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArchivoAuditoria" ADD CONSTRAINT "ArchivoAuditoria_auditoriaId_fkey" FOREIGN KEY ("auditoriaId") REFERENCES "Auditoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
