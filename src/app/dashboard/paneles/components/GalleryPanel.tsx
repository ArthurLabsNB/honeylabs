"use client";
import Image from "next/image";

export default function GalleryPanel({ images, onSelect, onClose }:{ images:string[]; onSelect:(src:string)=>void; onClose:()=>void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40">
      <div className="bg-[var(--dashboard-card)] p-4 rounded max-h-[80vh] overflow-auto w-[90vw] sm:w-[70vw]">
        <h2 className="font-semibold mb-2">Galería</h2>
        <div className="grid grid-cols-3 gap-2">
          {images.map((img,i)=>(
            <button key={i} onClick={()=>{onSelect(img); onClose();}} className="hover:opacity-80">
              <Image src={img} alt="ico" width={80} height={80} className="rounded"/>
            </button>
          ))}
        </div>
        <span title="Cerrar galería">
          <button onClick={onClose} className="mt-3 px-3 py-1 bg-white/10 rounded w-full text-sm">Cerrar</button>
        </span>
      </div>
    </div>
  );
}
