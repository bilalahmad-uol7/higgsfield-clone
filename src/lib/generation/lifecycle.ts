// Pure job-lifecycle rules shared by the API routes, the studio page and
// tests. Nothing here touches the database; callers apply the decisions.
import type { GenerationRow } from "@/lib/supabase/types";
import { hash, resolveResult } from "@/lib/generation/resolve";
import type { GenerationParams, Job, JobProvider, JobResult, JobStatus } from "@/lib/generation/types";

/** Time a real image job's worker gets before it must finish (it falls back to demo samples near the end). */
export const IMAGE_BUDGET_MS = 180_000;
/** Extra slack past `due_at` before a still-running image job is treated as a dead worker. */
export const STALE_GRACE_MS = 60_000;

const VIDEO_MIN_MS = 12_000;
const VIDEO_SPREAD_MS = 8_000;

/**
 * When a job is due. Mock video "renders" for 12–20s, derived from the job
 * so a replayed poll sees the same deadline; image jobs get their budget.
 */
export function dueAt(params: GenerationParams, jobId: string, now: number) {
  if (params.type === "image") return new Date(now + IMAGE_BUDGET_MS);
  return new Date(now + VIDEO_MIN_MS + (hash(`${jobId}::${params.prompt}`) % VIDEO_SPREAD_MS));
}

export function initialProvider(params: GenerationParams): JobProvider {
  return params.type === "image" ? "pollinations" : "mock";
}

/** Demo clips for a mock video job — the same picks the old client simulation made. */
export function mockVideoResults(params: GenerationParams): JobResult[] {
  return Array.from({ length: params.batchSize }, (_, i) => ({ media: resolveResult(params, i) }));
}

export type SettleAction = "none" | "complete-mock" | "fail-stale";

/**
 * What a read of a running job should do: finish a mock video whose render
 * time has passed, or fail (and refund) an image job whose worker died.
 */
export function settleAction(
  row: Pick<GenerationRow, "status" | "type" | "due_at">,
  now: number,
): SettleAction {
  if (row.status !== "running") return "none";
  const due = Date.parse(row.due_at);
  if (row.type === "video") return now >= due ? "complete-mock" : "none";
  return now >= due + STALE_GRACE_MS ? "fail-stale" : "none";
}

/** A stored generation as the studio renders it (finished jobs fully revealed). */
export function rowToJob(row: GenerationRow): Job {
  const status = row.status as JobStatus;
  const results = status === "complete" ? ((row.results ?? []) as JobResult[]) : [];
  return {
    id: row.id,
    createdAt: Date.parse(row.created_at),
    params: row.params as GenerationParams,
    stage: status === "complete" ? "complete" : "queued",
    progress: status === "complete" ? 100 : 0,
    queuePosition: 0,
    status,
    provider: row.provider as JobProvider,
    cost: row.cost,
    results,
    revealedCount: results.length,
    error: row.error ?? undefined,
  };
}
