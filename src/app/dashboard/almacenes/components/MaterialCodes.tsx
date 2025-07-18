"use client";
import { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { encodeQR } from "@/lib/qr";
import { buildQRPayload, QRObjectType } from "@/lib/buildQRPayload";
import JsBarcode from "jsbarcode";

export default function MaterialCodes({
  value,
  tipo,
  codigo,
  onRegenerate,
}: {
  value: string | Record<string, any>
  tipo?: QRObjectType
  codigo?: string
  onRegenerate?: () => void
}) {
  const barRef = useRef<SVGSVGElement>(null);
  const qrData =
    typeof value === 'object' && tipo ? buildQRPayload(tipo, value) : value;
  const qrValue = typeof qrData === 'string' ? qrData : encodeQR(qrData);

  const barValue = codigo ??
    (typeof value === 'object' ? (value as any).codigoQR ?? (value as any).codigoUnico : value);

  useEffect(() => {
    if (barRef.current && barValue) {
      try {
        JsBarcode(barRef.current, String(barValue), { format: 'CODE128', displayValue: false });
      } catch {}
    }
  }, [barValue]);

  return (
    <div className="flex flex-col items-start gap-2">
      <QRCodeSVG value={qrValue} size={128} />
      <svg ref={barRef} className="w-32 h-16" />
      {onRegenerate && (
        <button
          type="button"
          onClick={onRegenerate}
          className="px-2 py-1 text-xs rounded bg-white/10"
        >
          Regenerar
        </button>
      )}
    </div>
  )
}
