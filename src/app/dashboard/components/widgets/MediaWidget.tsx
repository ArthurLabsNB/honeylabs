"use client";

export default function MediaWidget({ url }:{ url:string }) {
  if (!url) return <div className="text-sm text-center">Sin URL</div>;
  if (url.match(/\.(mp4|webm)$/i)) {
    return <video src={url} controls className="w-full h-full" />;
  }
  if (url.match(/\.pdf$/i)) {
    return <embed src={url} type="application/pdf" className="w-full h-full" />;
  }
  return <iframe src={url} className="w-full h-full" />;
}
