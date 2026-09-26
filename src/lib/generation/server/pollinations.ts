// Pollinations.ai image client.
//
// Two modes:
//   * keyless (default): image.pollinations.ai — free, no signup, rate-limited
//     per IP, and the service picks the model (currently `sana`) and caps the
//     size below ~1MP.
//   * keyed: set POLLINATIONS_API_KEY (an `sk_` key from enter.pollinations.ai)
//     to use gen.pollinations.ai with a chosen model (POLLINATIONS_MODEL,
//     default `flux`). The key is sent as a header, never in a stored URL.
import { hash } from "@/lib/generation/resolve";
import type { AspectRatio, GenerationParams, Quality } from "@/lib/generation/types";

type Env = Record<string, string | undefined>;

const KEYLESS_BASE = "https://image.pollinations.ai/prompt/";
const KEYED_BASE = "https://gen.pollinations.ai/image/";

const LONG_EDGE: Record<Quality, number> = { "1.5k": 1024, "2k": 1280, "4K": 1536 };

export type PollinationsRequest = { url: string; headers: Record<string, string> };

export function isPollinationsDisabled(env: Env = process.env) {
  return env.POLLINATIONS_DISABLED === "1" || env.POLLINATIONS_DISABLED === "true";
}

/** Width/height for an aspect ratio at a quality tier, rounded to multiples of 16. */
export function imageDimensions(aspectRatio: AspectRatio, quality: Quality) {
  const [w, h] = aspectRatio.split(":").map(Number);
  const long = LONG_EDGE[quality];
  const round16 = (n: number) => Math.max(256, Math.round(n / 16) * 16);
  return w >= h
    ? { width: round16(long), height: round16((long * h) / w) }
    : { width: round16((long * w) / h), height: round16(long) };
}

/** Stable per-slot seed, so a retried slot redraws the same picture. */
export function seedFor(jobId: string, index: number) {
  return hash(`${jobId}::${index}`) % 2_147_483_647;
}

export function buildPollinationsRequest(
  params: GenerationParams,
  index: number,
  jobId: string,
  env: Env = process.env,
): PollinationsRequest {
  const { width, height } = imageDimensions(params.aspectRatio, params.quality);
  const query = new URLSearchParams({
    width: String(width),
    height: String(height),
    seed: String(seedFor(jobId, index)),
    nologo: "true",
    safe: "true",
  });
  const prompt = encodeURIComponent(params.prompt);
  const key = env.POLLINATIONS_API_KEY?.trim();

  if (key) {
    query.set("model", env.POLLINATIONS_MODEL?.trim() || "flux");
    return { url: `${KEYED_BASE}${prompt}?${query}`, headers: { authorization: `Bearer ${key}` } };
  }

  // Keep keyless takes out of Pollinations' public feed.
  query.set("nofeed", "true");
  query.set("private", "true");
  return { url: `${KEYLESS_BASE}${prompt}?${query}`, headers: {} };
}

export type FetchedImage = { bytes: Uint8Array; contentType: string };

/**
 * Fetch one image, retrying once. Throws if both attempts fail (timeout,
 * non-2xx, or a non-image body such as a JSON error page).
 */
export async function fetchPollinationsImage(
  req: PollinationsRequest,
  timeoutMs: number,
  attempts = 2,
): Promise<FetchedImage> {
  let lastError: unknown;
  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      const res = await fetch(req.url, { headers: req.headers, signal: AbortSignal.timeout(timeoutMs), cache: "no-store" });
      const contentType = res.headers.get("content-type") ?? "";
      if (!res.ok) throw new Error(`pollinations_http_${res.status}`);
      if (!contentType.startsWith("image/")) throw new Error(`pollinations_bad_type_${contentType || "none"}`);
      const bytes = new Uint8Array(await res.arrayBuffer());
      if (bytes.byteLength === 0) throw new Error("pollinations_empty");
      return { bytes, contentType: contentType.split(";")[0] };
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("pollinations_failed");
}
