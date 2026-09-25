"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Job } from "@/lib/generation/types";
import { Media } from "@/components/ui/Media";
import { useGenerationStore } from "@/lib/generation/store";

const STAGE_LABEL: Record<Job["stage"], (job: Job) => string> = {
  queued: (job) => `Queued — position ${job.queuePosition}`,
  preparing: () => "Preparing scene",
  generating: (job) => `Generating frames — ${Math.round(job.progress)}%`,
  upscaling: (job) => `Upscaling to ${job.params.quality}`,
  complete: () => "Complete",
};

function useElapsed(createdAt: number, running: boolean) {
  const [elapsed, setElapsed] = useState(() => Date.now() - createdAt);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setElapsed(Date.now() - createdAt), 500);
    return () => clearInterval(t);
  }, [createdAt, running]);
  return elapsed;
}

export function JobCard({ job }: { job: Job }) {
  const cancelJob = useGenerationStore((s) => s.cancelJob);
  const elapsed = useElapsed(job.createdAt, job.status === "running");
  const seconds = (elapsed / 1000).toFixed(1);

  const label = job.params.preset
    ? job.params.preset.replace(/-/g, " ")
    : job.params.model.replace(/-/g, " ");

  return (
    <div className="rounded-2xl border border-white-8 bg-surface-primary p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium capitalize text-white-90">{label}</p>
          <p className="mt-0.5 line-clamp-1 text-xs text-white-40">{job.params.prompt || "No prompt"}</p>
        </div>
        {job.status === "running" && (
          <button
            aria-label="Cancel generation"
            onClick={() => cancelJob(job.id)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white-6 text-white-60 hover:bg-white-10"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {job.status === "running" && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-white-60">
            <span>{STAGE_LABEL[job.stage](job)}</span>
            <span>{seconds}s</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-pill bg-white-8">
            <div
              className="h-full rounded-pill bg-rec transition-[width] duration-300 ease-out"
              style={{ width: `${Math.max(4, job.progress)}%` }}
            />
          </div>
        </div>
      )}

      {job.status === "cancelled" && (
        <p className="mt-3 text-xs text-white-40">Cancelled — credits refunded.</p>
      )}

      {job.results.length > 0 && (
        <div className={`mt-3 grid gap-2 ${job.params.batchSize > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
          {job.results.slice(0, job.revealedCount).map((result, i) => (
            <div
              key={i}
              className="relative aspect-square overflow-hidden rounded-xl bg-surface-tertiary"
            >
              <Media media={result.media} alt={`Result ${i + 1}`} sizes="(min-width: 1024px) 20vw, 45vw" />
            </div>
          ))}
          {Array.from({ length: job.params.batchSize - job.revealedCount }).map((_, i) => (
            <div
              key={`pending-${i}`}
              className="aspect-square animate-pulse rounded-xl bg-white-6"
            />
          ))}
        </div>
      )}
    </div>
  );
}
