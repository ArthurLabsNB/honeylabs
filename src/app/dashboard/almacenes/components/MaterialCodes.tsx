"use client";
import { useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react/esm";
import JsBarcode from "jsbarcode";

export default function MaterialCodes({ value }: { value: string }) {
  const barRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barRef.current) {
      try {
        JsBarcode(barRef.current, value, { format: "CODE128", displayValue: false });
      } catch {}
    }
  }, [value]);

  return (
    <div className="flex flex-col items-start gap-4">
      <QRCodeSVG value={value} size={128} />
      <svg ref={barRef} className="w-32 h-16" />
    </div>
  );
}
