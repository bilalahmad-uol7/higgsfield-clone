"use client";

import { useGenerationStore, useHasHydrated } from "@/lib/generation/store";
import { JobCard } from "@/components/create/JobCard";
import { Viewfinder } from "@/components/motion/Viewfinder";

export function JobFeed() {
  const jobs = useGenerationStore((s) => s.jobs);
  // Wait for the persisted store to hydrate from localStorage before
  // rendering so we don't flash an empty state ahead of real history.
  const hydrated = useHasHydrated();

  if (!hydrated) return null;

  if (jobs.length === 0) {
    return (
      <div className="relative flex min-h-72 flex-col items-center justify-center border border-white-10 bg-ink-raised px-6 text-center md:aspect-video">
        <Viewfinder inset="inset-4" />
        <p className="slate text-white-40">No signal</p>
        <p className="display mt-4 text-balance text-3xl md:text-4xl">
          Nothing in the can <em>yet.</em>
        </p>
        <p className="mt-2 text-sm text-white-60">Write a prompt, set the camera, and roll your first take.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {jobs.map((job, i) => (
        <JobCard key={job.id} job={job} take={jobs.length - i} />
      ))}
    </div>
  );
}
