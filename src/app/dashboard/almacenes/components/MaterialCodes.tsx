"use client";
import { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { encodeQR } from "@/lib/qr";
import JsBarcode from "jsbarcode";

export default function MaterialCodes({
  value,
  onRegenerate,
}: {
  value: string | Record<string, any>
  onRegenerate?: () => void
}) {
  const barRef = useRef<SVGSVGElement>(null);
  const qrValue = typeof value === 'string' ? value : encodeQR(value);

  useEffect(() => {
    if (barRef.current) {
      try {
        JsBarcode(barRef.current, String(value), { format: "CODE128", displayValue: false });
      } catch {}
    }
  }, [value]);

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
