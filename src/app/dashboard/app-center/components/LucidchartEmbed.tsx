"use client";

interface LucidchartEmbedProps {
  docId: string;
}

export default function LucidchartEmbed({ docId }: LucidchartEmbedProps) {
  const url = `https://lucid.app/documents/embeddedchart/${docId}?embed=1`;
  return (
    <iframe
      src={url}
      className="w-full h-[600px] rounded-lg border"
      allowFullScreen
      data-oid="u3rndlc"
    />
  );
}
