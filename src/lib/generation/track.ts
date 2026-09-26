import type { Job } from "@/lib/generation/types";

// Follows one server-side job to completion. Two loops run side by side:
//   * a poller asks GET /api/generations/:id every couple of seconds until
//     the job is no longer running (the server is the only source of truth);
//   * the staged progress animation plays meanwhile, holding at 92% until
//     the server has an answer, then upscales and reveals the real results.

const POLL_MS = 2000;
const HOLD_AT = 92;

const tracking = new Set<string>();

type ServerView = { job: Job; credits: number };

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

async function fetchJob(id: string): Promise<ServerView | "gone" | null> {
  try {
    const res = await fetch(`/api/generations/${encodeURIComponent(id)}`, { cache: "no-store" });
    if (res.status === 404) return "gone";
    if (!res.ok) return null; // transient — try again next tick
    return (await res.json()) as ServerView;
  } catch {
    return null;
  }
}

/** Start following a job; a no-op if this tab already follows it. */
export function trackJob(id: string) {
  if (tracking.has(id)) return;
  tracking.add(id);
  void follow(id).finally(() => tracking.delete(id));
}

async function follow(id: string) {
  // Deferred import breaks the store<->track circular dependency.
  const { useGenerationStore } = await import("@/lib/generation/store");
  const { getState } = useGenerationStore;
  const isRunning = () => getState().getJob(id)?.status === "running";

  let answer: ServerView | "gone" | null = null;
  const settled = () => answer !== null;

  const poller = (async () => {
    while (isRunning()) {
      const view = await fetchJob(id);
      if (view === "gone" || (view && view.job.status !== "running")) {
        answer = view;
        return;
      }
      await delay(POLL_MS);
    }
  })();

  await animate(id, isRunning, settled);
  await poller;
  // Assigned inside the poller closure, which TS's narrowing can't see.
  const final = answer as ServerView | "gone" | null;
  if (!isRunning() || final === null) return;

  if (final === "gone") {
    getState().patchJob(id, { status: "failed", error: "not_found" });
    return;
  }

  const { job, credits } = final;
  getState().setCredits(credits);

  if (job.status !== "complete") {
    getState().patchJob(id, { status: job.status, error: job.error, results: [], revealedCount: 0 });
    return;
  }

  // --- upscaling ---
  getState().patchJob(id, { stage: "upscaling" });
  for (const p of [95, 98, 100]) {
    await delay(rand(250, 400));
    if (!isRunning()) return;
    getState().patchJob(id, { progress: p });
  }

  // --- complete: reveal the batch progressively ---
  getState().patchJob(id, { stage: "complete", provider: job.provider, results: job.results, revealedCount: 0 });
  for (let i = 1; i <= job.results.length; i++) {
    await delay(rand(250, 450));
    if (!isRunning()) return;
    getState().patchJob(id, { revealedCount: i });
  }
  getState().patchJob(id, { status: "complete" });
}

// queued -> preparing -> generating (uneven: fast, slow, fast), holding at
// 92% until the server answers. Once it has, the rest plays out quickly.
async function animate(id: string, isRunning: () => boolean, settled: () => boolean) {
  const { useGenerationStore } = await import("@/lib/generation/store");
  const { getState } = useGenerationStore;

  let queuePosition = getState().getJob(id)?.queuePosition ?? 0;
  while (queuePosition > 0 && isRunning() && !settled()) {
    await delay(rand(350, 550));
    if (!isRunning()) return;
    queuePosition -= 1;
    getState().patchJob(id, { queuePosition, stage: "queued" });
  }
  if (!isRunning()) return;

  getState().patchJob(id, { stage: "preparing", progress: 4 });
  await delay(settled() ? 150 : rand(900, 1400));
  if (!isRunning()) return;

  getState().patchJob(id, { stage: "generating" });
  let progress = 4;
  while (isRunning() && !(settled() && progress >= HOLD_AT)) {
    let step: number;
    let wait: number;
    if (settled()) {
      step = 12;
      wait = 60;
    } else if (progress >= HOLD_AT) {
      step = 0;
      wait = 250;
    } else if (progress < 30) {
      step = rand(4, 9);
      wait = rand(180, 320);
    } else if (progress < 75) {
      step = rand(1, 3.5);
      wait = rand(280, 480);
    } else {
      step = rand(0.5, 2);
      wait = rand(300, 500);
    }
    await delay(wait);
    if (!isRunning()) return;
    if (step > 0) {
      progress = Math.min(HOLD_AT, progress + step);
      getState().patchJob(id, { progress });
    }
  }
}
