// Runs one image job after its credits were charged. Dependencies are
// injected so the fallback / refund rules can be tested without a network,
// Storage or database (see image-job.test.ts); run-image-job.ts wires the real ones.
import { resolveResult } from "@/lib/generation/resolve";
import type { GenerationParams, JobProvider, JobResult } from "@/lib/generation/types";

export type ImageJobDeps = {
  /** Fetch image bytes for a slot; throws when the provider fails. */
  generate: (index: number, timeoutMs: number) => Promise<{ bytes: Uint8Array; contentType: string }>;
  /** Store bytes; returns the object path and its public URL. Throws on failure. */
  upload: (index: number, image: { bytes: Uint8Array; contentType: string }) => Promise<{ path: string; url: string }>;
  remove: (paths: string[]) => Promise<void>;
  isRunning: () => Promise<boolean>;
  /** running -> complete; false when the job was cancelled/failed meanwhile. */
  finish: (results: JobResult[], provider: JobProvider) => Promise<boolean>;
  /** running -> failed + refund. */
  fail: (error: string) => Promise<void>;
  /** true forces every slot onto demo samples (POLLINATIONS_DISABLED). */
  disabled: boolean;
  now: () => number;
};

export type ImageJobOutcome = "complete" | "stopped" | "failed";

/** Per-image wait; the remaining budget can shorten it. */
const IMAGE_TIMEOUT_MS = 45_000;
/** Below this much budget left, don't start a Pollinations call — use a sample. */
const MIN_ATTEMPT_MS = 5_000;

export function providerFor(fallbacks: number, total: number): JobProvider {
  if (fallbacks === 0) return "pollinations";
  return fallbacks === total ? "mock-fallback" : "pollinations+fallback";
}

export async function executeImageJob(
  params: GenerationParams,
  deadline: number,
  deps: ImageJobDeps,
): Promise<ImageJobOutcome> {
  const results: JobResult[] = [];
  const uploaded: string[] = [];
  let fallbacks = 0;

  try {
    // One at a time: the keyless tier is rate-limited per IP.
    for (let i = 0; i < params.batchSize; i++) {
      if (i > 0 && !(await deps.isRunning())) {
        await deps.remove(uploaded);
        return "stopped";
      }

      const remaining = deadline - deps.now() - MIN_ATTEMPT_MS;
      let image: { bytes: Uint8Array; contentType: string } | null = null;
      if (!deps.disabled && remaining > MIN_ATTEMPT_MS) {
        // Two attempts share the slot's timeout budget.
        const timeout = Math.min(IMAGE_TIMEOUT_MS, Math.floor(remaining / 2));
        image = await deps.generate(i, timeout).catch((err) => {
          console.warn(`pollinations slot ${i} failed, using demo sample:`, err instanceof Error ? err.message : err);
          return null;
        });
      }

      if (image) {
        // Storage/DB errors are ours, not the provider's: they fail the job
        // (with a refund) rather than quietly shipping a sample.
        const stored = await deps.upload(i, image);
        uploaded.push(stored.path);
        results.push({ media: { url: stored.url } });
      } else {
        fallbacks += 1;
        results.push({ media: resolveResult(params, i), fallback: true });
      }
    }

    const finished = await deps.finish(results, providerFor(fallbacks, params.batchSize));
    if (!finished) {
      await deps.remove(uploaded);
      return "stopped";
    }
    return "complete";
  } catch (err) {
    console.error("image job failed", err);
    await deps.remove(uploaded).catch(() => {});
    await deps.fail(err instanceof Error ? err.message : "internal_error");
    return "failed";
  }
}
