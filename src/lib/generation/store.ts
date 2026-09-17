import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GenerationParams, Job } from "@/lib/generation/types";
import { creditCost } from "@/lib/generation/types";
import { runJob } from "@/lib/generation/simulate";

const STARTING_CREDITS = 120;

type GenerationState = {
  credits: number;
  jobs: Job[];
  submitJob: (params: GenerationParams) => string;
  cancelJob: (id: string) => void;
  patchJob: (id: string, patch: Partial<Job>) => void;
  getJob: (id: string) => Job | undefined;
};

export const useGenerationStore = create<GenerationState>()(
  persist(
    (set, get) => ({
      credits: STARTING_CREDITS,
      jobs: [],

      submitJob: (params) => {
        const cost = creditCost(params);
        const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        const job: Job = {
          id,
          createdAt: Date.now(),
          params,
          stage: "queued",
          progress: 0,
          queuePosition: 1 + Math.floor(Math.random() * 3),
          status: "running",
          cost,
          results: [],
          revealedCount: 0,
        };
        set((s) => ({ credits: s.credits - cost, jobs: [job, ...s.jobs] }));
        runJob(id);
        return id;
      },

      cancelJob: (id) => {
        const job = get().jobs.find((j) => j.id === id);
        if (!job || job.status !== "running") return;
        set((s) => ({
          credits: s.credits + job.cost,
          jobs: s.jobs.map((j) => (j.id === id ? { ...j, status: "cancelled" } : j)),
        }));
      },

      patchJob: (id, patch) => {
        set((s) => ({
          jobs: s.jobs.map((j) => (j.id === id ? { ...j, ...patch } : j)),
        }));
      },

      getJob: (id) => get().jobs.find((j) => j.id === id),
    }),
    {
      name: "higgsfield-clone-generation",
      partialize: (s) => ({ credits: s.credits, jobs: s.jobs }),
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
