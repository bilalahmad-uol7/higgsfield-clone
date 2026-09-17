import { resolveResult } from "@/lib/generation/resolve";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

// Runs the fake async generation pipeline for a job that already exists in
// the store. Every step re-checks the job's live status so a cancel() call
// stops the chain immediately instead of racing it.
export async function runJob(id: string) {
  // Deferred import breaks the store<->simulate circular dependency: by the
  // time this function actually runs (after submitJob call-site), both
  // modules have finished evaluating, so this resolves safely.
  const { useGenerationStore } = await import("@/lib/generation/store");
  const { getState } = useGenerationStore;

  function isRunning() {
    return getState().getJob(id)?.status === "running";
  }

  // --- queued ---
  let queuePosition = getState().getJob(id)?.queuePosition ?? 1;
  while (queuePosition > 0 && isRunning()) {
    await delay(rand(350, 550));
    if (!isRunning()) return;
    queuePosition -= 1;
    getState().patchJob(id, { queuePosition, stage: "queued" });
  }
  if (!isRunning()) return;

  // --- preparing ---
  getState().patchJob(id, { stage: "preparing", progress: 4 });
  await delay(rand(900, 1400));
  if (!isRunning()) return;

  // --- generating (uneven progress: fast, slow, fast) ---
  getState().patchJob(id, { stage: "generating" });
  let progress = 4;
  while (progress < 92 && isRunning()) {
    let step: number;
    let wait: number;
    if (progress < 30) {
      step = rand(4, 9);
      wait = rand(180, 320);
    } else if (progress < 75) {
      step = rand(1, 3.5);
      wait = rand(280, 480);
    } else {
      step = rand(3, 6);
      wait = rand(140, 260);
    }
    await delay(wait);
    if (!isRunning()) return;
    progress = Math.min(92, progress + step);
    getState().patchJob(id, { progress });
  }
  if (!isRunning()) return;

  // --- upscaling ---
  getState().patchJob(id, { stage: "upscaling" });
  for (const p of [95, 98, 100]) {
    await delay(rand(350, 550));
    if (!isRunning()) return;
    getState().patchJob(id, { progress: p });
  }
  if (!isRunning()) return;

  // --- complete: reveal batch results progressively ---
  const params = getState().getJob(id)?.params;
  if (!params) return;
  const results = Array.from({ length: params.batchSize }, (_, i) => ({
    media: resolveResult(params, i),
  }));
  getState().patchJob(id, { stage: "complete", results, revealedCount: 0 });

  for (let i = 1; i <= params.batchSize; i++) {
    await delay(rand(250, 450));
    if (!isRunning()) return;
    getState().patchJob(id, { revealedCount: i });
  }
  if (!isRunning()) return;
  getState().patchJob(id, { status: "complete" });
}
