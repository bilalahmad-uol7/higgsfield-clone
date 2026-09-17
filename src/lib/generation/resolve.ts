import type { MediaRef } from "@/lib/media";
import { EFFECTS } from "@/data/landing";
import { DEMO_IMAGE_POOL, DEMO_VIDEO_POOL } from "@/data/demo-results";
import type { GenerationParams } from "@/lib/generation/types";

// Deterministic djb2 hash so the same prompt+index always resolves to the
// same demo clip (stable across re-renders/refresh) while different prompts
// visibly return different results.
function hash(input: string) {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }
  return Math.abs(h);
}

export function resolveResult(params: GenerationParams, index: number): MediaRef {
  if (params.preset) {
    const effect = EFFECTS.find((e) => e.slug === params.preset);
    if (effect) {
      if (index === 0) return effect.preview;
      const pool = DEMO_VIDEO_POOL;
      return pool[hash(params.prompt + params.preset + index) % pool.length];
    }
  }

  const pool = params.type === "image" ? DEMO_IMAGE_POOL : DEMO_VIDEO_POOL;
  const seed = hash(`${params.prompt}::${params.model}::${index}`);
  return pool[seed % pool.length];
}
