"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Job } from "@/lib/generation/types";
import { Media } from "@/components/ui/Media";
import { Timecode } from "@/components/motion/Timecode";
import { useGenerationStore } from "@/lib/generation/store";
import { cn } from "@/lib/cn";

const STAGE_LABEL: Record<Job["stage"], (job: Job) => string> = {
  queued: (job) => `Queued — position ${job.queuePosition}`,
  preparing: () => "Preparing scene",
  generating: (job) => `Generating frames — ${Math.round(job.progress)}%`,
  upscaling: (job) => `Upscaling to ${job.params.quality}`,
  complete: () => "Complete",
};

const PROVIDER_LABEL: Record<Job["provider"], string> = {
  pollinations: "Rendered by Pollinations.ai",
  "pollinations+fallback": "Pollinations.ai · some slots are samples",
  mock: "Simulated video · sample clips",
  "mock-fallback": "Samples · image service unavailable",
};

const STATUS_LABEL: Record<Job["status"], string> = {
  running: "Rolling",
  complete: "Wrapped",
  cancelled: "Cut",
  failed: "Failed",
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

// One roll of the camera, laid out like a take on a film slate.
export function JobCard({ job, take }: { job: Job; take: number }) {
  const cancelJob = useGenerationStore((s) => s.cancelJob);
  const running = job.status === "running";
  const elapsed = useElapsed(job.createdAt, running);
  const seconds = (elapsed / 1000).toFixed(1);

  const label = job.params.preset
    ? job.params.preset.replace(/-/g, " ")
    : job.params.model.replace(/-/g, " ");

  return (
    <article className="border border-white-10 bg-ink-raised">
      <header className="flex items-center justify-between gap-4 border-b border-white-10 px-4 py-3">
        <div className="slate flex min-w-0 items-center gap-3 text-white-40">
          <span className={running ? "text-rec" : "text-paper"}>Take {String(take).padStart(2, "0")}</span>
          <span className="truncate">
            {label} · {job.params.aspectRatio} · {job.params.quality} · ×{job.params.batchSize}
          </span>
        </div>
        {running ? (
          <div className="flex shrink-0 items-center gap-3">
            <span className="slate flex items-center gap-2 text-paper">
              <span className="h-1.5 w-1.5 animate-rec rounded-full bg-rec" />
              Rec <Timecode startAt={job.createdAt} className="text-white-60" />
            </span>
            <button
              aria-label="Cancel generation"
              onClick={() => cancelJob(job.id)}
              className="flex h-7 w-7 items-center justify-center border border-white-16 text-white-60 hover:border-rec hover:text-rec"
            >
              <X size={13} />
            </button>
          </div>
        ) : (
          <span className={cn("slate shrink-0", job.status === "failed" ? "text-rec" : "text-white-40")}>
            {STATUS_LABEL[job.status]}
          </span>
        )}
      </header>

      <p className="px-4 pt-3 text-sm text-white-70">{job.params.prompt || "No prompt"}</p>

      {running && (
        <div className="px-4 pt-3">
          <div className="slate flex items-center justify-between text-white-60">
            <span>{STAGE_LABEL[job.stage](job)}</span>
            <span className="tabular-nums">{seconds}s</span>
          </div>
          <div className="mt-2 h-0.5 w-full bg-white-8">
            <div
              className="h-full bg-rec transition-[width] duration-300 ease-out"
              style={{ width: `${Math.max(4, job.progress)}%` }}
            />
          </div>
        </div>
      )}

      {job.status === "complete" && (
        <p className="slate px-4 pt-2 text-white-40">
          {PROVIDER_LABEL[job.provider]} · {job.cost} cr
        </p>
      )}

      {job.status === "cancelled" && (
        <p className="slate px-4 pt-3 text-white-40">Cut before wrap — {job.cost} credits refunded.</p>
      )}

      {job.status === "failed" && (
        <p className="slate px-4 pt-3 text-rec">The take didn&apos;t make it — {job.cost} credits refunded.</p>
      )}

      {job.results.length > 0 ? (
        <div className={cn("grid gap-1 p-4", job.params.batchSize > 1 ? "grid-cols-2" : "grid-cols-1")}>
          {job.results.slice(0, job.revealedCount).map((result, i) => (
            <div key={i} className="relative aspect-video overflow-hidden bg-ink">
              <div className="absolute inset-0 animate-develop">
                <Media media={result.media} alt={`Take ${take}, result ${i + 1}`} sizes="(min-width: 1024px) 30vw, 90vw" />
              </div>
              <span className="slate absolute left-2 top-2 text-paper/80">
                {String(take).padStart(2, "0")}.{i + 1}
              </span>
              {result.fallback && (
                <span className="slate absolute right-2 top-2 bg-ink/80 px-1.5 py-0.5 text-white-60">Sample</span>
              )}
            </div>
          ))}
          {Array.from({ length: Math.max(0, job.results.length - job.revealedCount) }).map((_, i) => (
            <div key={`pending-${i}`} className="relative flex aspect-video items-center justify-center bg-ink">
              <span className="slate animate-pulse text-white-24">Developing…</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="pb-4" />
      )}
    </article>
  );
}
