import { ASPECT_RATIOS, CREATE_MODELS, QUALITIES } from "@/data/create-models";
import { EFFECTS } from "@/data/landing";
import type { GenerationParams } from "@/lib/generation/types";

const JOB_ID = /^[A-Za-z0-9_-]{6,64}$/;
const MAX_PROMPT = 2000;

export function isValidJobId(id: unknown): id is string {
  return typeof id === "string" && JOB_ID.test(id);
}

// Rebuilds params from untrusted JSON using only known values, so the server
// prices exactly what it validated — nothing the client made up.
export function parseGenerationParams(input: unknown): GenerationParams | null {
  if (!input || typeof input !== "object") return null;
  const p = input as Record<string, unknown>;

  const type = p.type === "image" || p.type === "video" ? p.type : null;
  if (!type) return null;

  const model = CREATE_MODELS.find((m) => m.id === p.model && m.type === type);
  const aspectRatio = ASPECT_RATIOS.find((a) => a === p.aspectRatio);
  const quality = QUALITIES.find((q) => q === p.quality);
  const batchSize = Number.isInteger(p.batchSize) ? (p.batchSize as number) : NaN;
  const prompt = typeof p.prompt === "string" ? p.prompt.trim() : "";
  const preset =
    p.preset === undefined || p.preset === null ? undefined : EFFECTS.find((e) => e.slug === p.preset)?.slug;

  if (!model || !aspectRatio || !quality || !prompt || prompt.length > MAX_PROMPT) return null;
  if (!(batchSize >= 1 && batchSize <= 4)) return null;
  if (p.preset != null && (!preset || type !== "video")) return null;

  return { type, model: model.id, preset, prompt, aspectRatio, quality, batchSize };
}
