-- Add JSON column estado to HistorialLote and HistorialUnidad if not present
ALTER TABLE "HistorialLote" ADD COLUMN IF NOT EXISTS "estado" JSONB;
ALTER TABLE "HistorialUnidad" ADD COLUMN IF NOT EXISTS "estado" JSONB;
