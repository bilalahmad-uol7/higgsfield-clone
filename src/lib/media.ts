// Flips every media reference in the app between Higgsfield's live CDN and a
// vendored local copy, so a demo never breaks on a hotlink going down or bad
// wifi. Toggle with NEXT_PUBLIC_MEDIA_SOURCE=local (see .env.example).
const SOURCE = process.env.NEXT_PUBLIC_MEDIA_SOURCE === "local" ? "local" : "cdn";

const CDN = "https://cdn.higgsfield.ai";
const STATIC = "https://static.higgsfield.ai";

export type MediaRef = {
  /** absolute URL of media we host ourselves (generated images in Supabase Storage) */
  url?: string;
  /** path relative to cdn.higgsfield.ai, e.g. "card/<uuid>.mp4" */
  cdn?: string;
  /** path relative to static.higgsfield.ai */
  staticCdn?: string;
  /** filename under /public/demo/ used when SOURCE === "local" */
  local?: string;
};

export function mediaUrl(ref: MediaRef): string {
  if (ref.url) return ref.url;
  if (SOURCE === "local") return `/demo/${ref.local}`;
  if (ref.cdn) return `${CDN}/${ref.cdn}`;
  if (ref.staticCdn) return `${STATIC}/${ref.staticCdn}`;
  return `/demo/${ref.local}`;
}

export function isVideo(url: string) {
  return url.endsWith(".mp4");
}
