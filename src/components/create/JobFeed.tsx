"use client";

import { useGenerationStore, useHasHydrated } from "@/lib/generation/store";
import { JobCard } from "@/components/create/JobCard";

export function JobFeed() {
  const jobs = useGenerationStore((s) => s.jobs);
  // Wait for the persisted store to hydrate from localStorage before
  // rendering so we don't flash an empty state ahead of real history.
  const hydrated = useHasHydrated();

  if (!hydrated) return null;

  if (jobs.length === 0) {
    return (
      <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white-8 text-center">
        <p className="text-sm text-white-60">No generations yet</p>
        <p className="mt-1 text-xs text-white-40">Set your prompt and hit Generate to start.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
}
