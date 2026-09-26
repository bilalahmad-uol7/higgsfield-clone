"use client";

import { useEffect } from "react";
import { useGenerationStore } from "@/lib/generation/store";
import type { Job } from "@/lib/generation/types";
import { JobCard } from "@/components/create/JobCard";
import { Viewfinder } from "@/components/motion/Viewfinder";

export function JobFeed({ initialJobs }: { initialJobs: Job[] }) {
  const storeJobs = useGenerationStore((s) => s.jobs);
  const hydrated = useGenerationStore((s) => s.hydrated);
  const hydrate = useGenerationStore((s) => s.hydrate);

  // History is this user's server-side takes; load them into the store (and
  // resume following any still rolling). Until then render the server list
  // directly so there's no empty flash.
  useEffect(() => {
    hydrate(initialJobs);
  }, [initialJobs, hydrate]);

  const jobs = hydrated ? storeJobs : initialJobs;

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
