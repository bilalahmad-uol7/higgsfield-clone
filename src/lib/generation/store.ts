import { create } from "zustand";
import type { GenerationParams, Job } from "@/lib/generation/types";
import { HISTORY_LIMIT, creditCost } from "@/lib/generation/types";
import { trackJob } from "@/lib/generation/track";

export type SubmitResult = { ok: true; id: string } | { ok: false; error: string };

const ERRORS: Record<string, string> = {
  insufficient_credits: "Not enough credits — top up to continue.",
  unauthorized: "Your session expired — log in again.",
  invalid_params: "Those settings aren't valid. Check the form and try again.",
  too_many_jobs: "Three takes are already rolling — wait for one to wrap.",
};

// Take history used to live in localStorage, where every account on the
// same browser shared it. It now comes only from the server, per user; drop
// the old copy once.
const LEGACY_STORAGE_KEY = "higgsfield-clone-generation";
if (typeof window !== "undefined") {
  try {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    // Storage blocked (private mode etc.) — nothing to clear.
  }
}

type GenerationState = {
  /**
   * Server-authoritative balance (Supabase `profiles.credits`). Null until
   * the page seeds it from the server; never persisted locally.
   */
  credits: number | null;
  /** The signed-in user's latest takes, newest first, at most HISTORY_LIMIT. */
  jobs: Job[];
  /** True once the studio has loaded this user's history from the server. */
  hydrated: boolean;
  setCredits: (credits: number) => void;
  hydrate: (jobs: Job[]) => void;
  submitJob: (params: GenerationParams) => Promise<SubmitResult>;
  cancelJob: (id: string) => Promise<void>;
  patchJob: (id: string, patch: Partial<Job>) => void;
  getJob: (id: string) => Job | undefined;
  reset: () => void;
};

async function readError(res: Response) {
  const body = (await res.json().catch(() => ({}))) as { error?: string };
  return ERRORS[body.error ?? ""] ?? "Couldn't start this take. Try again.";
}

function newJobId() {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useGenerationStore = create<GenerationState>()((set, get) => ({
  credits: null,
  jobs: [],
  hydrated: false,

  setCredits: (credits) => set({ credits }),

  // Server rows are the truth. A take this tab is already animating keeps
  // its live state while the server still agrees on its status.
  hydrate: (serverJobs) => {
    const current = get().jobs;
    const jobs = serverJobs.slice(0, HISTORY_LIMIT).map((job) => {
      const live = current.find((j) => j.id === job.id);
      return live && live.status === job.status ? live : job;
    });
    set({ jobs, hydrated: true });
    for (const job of jobs) if (job.status === "running") trackJob(job.id);
  },

  // The server charges and records the take (computing the price itself);
  // the card only appears once that has succeeded.
  submitJob: async (params) => {
    const id = newJobId();
    const res = await fetch("/api/generations", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jobId: id, params }),
    });
    if (!res.ok) return { ok: false, error: await readError(res) };

    const { credits } = (await res.json()) as { credits: number };
    const job: Job = {
      id,
      createdAt: Date.now(),
      params,
      stage: "queued",
      progress: 0,
      queuePosition: 1 + Math.floor(Math.random() * 3),
      status: "running",
      provider: params.type === "image" ? "pollinations" : "mock",
      cost: creditCost(params),
      results: [],
      revealedCount: 0,
    };
    set((s) => ({ credits, jobs: [job, ...s.jobs].slice(0, HISTORY_LIMIT) }));
    trackJob(id);
    return { ok: true, id };
  },

  cancelJob: async (id) => {
    const job = get().jobs.find((j) => j.id === id);
    if (!job || job.status !== "running") return;
    // Stop the animation immediately; the server decides the refund.
    get().patchJob(id, { status: "cancelled" });
    const res = await fetch(`/api/generations/${encodeURIComponent(id)}/cancel`, { method: "POST" });
    if (res.ok) {
      const { credits } = (await res.json()) as { credits: number };
      set({ credits });
      return;
    }
    // Too late (it wrapped first) or a transient error: show what the
    // server actually has for this take.
    get().patchJob(id, { status: "running" });
    trackJob(id);
  },

  patchJob: (id, patch) => {
    set((s) => ({
      jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
    }));
  },

  getJob: (id) => get().jobs.find((j) => j.id === id),

  reset: () => set({ jobs: [], credits: null, hydrated: false }),
}));

/** Live balance: the store once seeded, otherwise the server-rendered value. */
export function useCredits(fallback: number) {
  return useGenerationStore((s) => s.credits) ?? fallback;
}
