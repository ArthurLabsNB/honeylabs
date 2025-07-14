"use client";
import MediaWidget from "../../components/widgets/MediaWidget";

export default function UrlCard({ url }: { url?: string }) {
  if (!url) return <div className="text-sm text-center">Sin URL</div>;
  return <MediaWidget url={url} />;
}
