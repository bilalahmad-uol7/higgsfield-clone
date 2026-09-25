import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GenerationParams, Job } from "@/lib/generation/types";
import { creditCost } from "@/lib/generation/types";
import { runJob } from "@/lib/generation/simulate";

export type SubmitResult = { ok: true; id: string } | { ok: false; error: string };

const ERRORS: Record<string, string> = {
  insufficient_credits: "Not enough credits — top up to continue.",
  unauthorized: "Your session expired — log in again.",
  invalid_params: "Those settings aren't valid. Check the form and try again.",
};

type GenerationState = {
  /**
   * Server-authoritative balance (Supabase `profiles.credits`). Null until
   * the page seeds it from the server; never persisted locally.
   */
  credits: number | null;
  jobs: Job[];
  setCredits: (credits: number) => void;
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

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set, get) => ({
      credits: null,
      jobs: [],

      setCredits: (credits) => set({ credits }),

      // The server charges first (and computes the price itself); the
      // simulated render only starts once the debit has succeeded.
      submitJob: async (params) => {
        const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
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
          cost: creditCost(params),
          results: [],
          revealedCount: 0,
        };
        set((s) => ({ credits, jobs: [job, ...s.jobs] }));
        runJob(id);
        return { ok: true, id };
      },

      cancelJob: async (id) => {
        const job = get().jobs.find((j) => j.id === id);
        if (!job || job.status !== "running") return;
        // Stop the render immediately; the refund settles on the server.
        set((s) => ({ jobs: s.jobs.map((j) => (j.id === id ? { ...j, status: "cancelled" } : j)) }));
        const res = await fetch(`/api/generations/${encodeURIComponent(id)}/cancel`, { method: "POST" });
        if (res.ok) {
          const { credits } = (await res.json()) as { credits: number };
          set({ credits });
        }
      },

      patchJob: (id, patch) => {
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        }));
      },

      getJob: (id) => get().jobs.find((j) => j.id === id),

      reset: () => set({ jobs: [], credits: null }),
    }),
    {
      name: "higgsfield-clone-generation",
      // Only take history lives locally; credits always come from the server.
      partialize: (s) => ({ jobs: s.jobs }),
      merge: (persisted, current) => ({
        ...current,
        jobs: (persisted as { jobs?: Job[] } | undefined)?.jobs ?? [],
      }),
    },
  ),
);

// Zustand's persist middleware hydrates from localStorage asynchronously on
// the client, after the initial render. Subscribing via useSyncExternalStore
// (rather than flipping a state flag inside a useEffect) avoids a spurious
// extra render pass and the "no setState in effects" lint rule.
export function useHasHydrated() {
  return useSyncExternalStore(
    (callback) => useGenerationStore.persist.onFinishHydration(callback),
    () => useGenerationStore.persist.hasHydrated(),
    () => false,
  );
}

/** Live balance: the store once seeded, otherwise the server-rendered value. */
export function useCredits(fallback: number) {
  return useGenerationStore((s) => s.credits) ?? fallback;
}
