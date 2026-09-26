import { describe, expect, it } from "vitest";
import {
  IMAGE_BUDGET_MS,
  STALE_GRACE_MS,
  dueAt,
  initialProvider,
  mockVideoResults,
  rowToJob,
  settleAction,
} from "@/lib/generation/lifecycle";
import type { GenerationParams } from "@/lib/generation/types";
import type { GenerationRow } from "@/lib/supabase/types";

const video: GenerationParams = {
  type: "video",
  model: "seedance-2.5",
  prompt: "a skater at golden hour",
  aspectRatio: "16:9",
  quality: "2k",
  batchSize: 2,
};
const image: GenerationParams = { ...video, type: "image", model: "flux-2" };
const NOW = Date.parse("2026-09-27T12:00:00Z");

describe("dueAt", () => {
  it("gives mock video a stable 12–20s render time", () => {
    const due = dueAt(video, "job_abc123", NOW).getTime() - NOW;
    expect(due).toBeGreaterThanOrEqual(12_000);
    expect(due).toBeLessThan(20_000);
    expect(dueAt(video, "job_abc123", NOW).getTime()).toBe(NOW + due);
  });

  it("gives image jobs the worker budget", () => {
    expect(dueAt(image, "job_abc123", NOW).getTime()).toBe(NOW + IMAGE_BUDGET_MS);
  });
});

describe("initialProvider / mockVideoResults", () => {
  it("marks video as mock and image as pollinations", () => {
    expect(initialProvider(video)).toBe("mock");
    expect(initialProvider(image)).toBe("pollinations");
  });

  it("returns one deterministic demo clip per batch slot", () => {
    const results = mockVideoResults(video);
    expect(results).toHaveLength(2);
    expect(mockVideoResults(video)).toEqual(results);
  });
});

describe("settleAction", () => {
  const due = new Date(NOW).toISOString();

  it("completes mock video once due, not before", () => {
    expect(settleAction({ status: "running", type: "video", due_at: due }, NOW - 1)).toBe("none");
    expect(settleAction({ status: "running", type: "video", due_at: due }, NOW)).toBe("complete-mock");
  });

  it("fails an image job only after the grace period", () => {
    expect(settleAction({ status: "running", type: "image", due_at: due }, NOW + STALE_GRACE_MS - 1)).toBe("none");
    expect(settleAction({ status: "running", type: "image", due_at: due }, NOW + STALE_GRACE_MS)).toBe("fail-stale");
  });

  it.each(["complete", "failed", "cancelled"])("leaves a %s job alone", (status) => {
    expect(settleAction({ status, type: "video", due_at: due }, NOW + 10 * 60_000)).toBe("none");
  });
});

describe("rowToJob", () => {
  const row: GenerationRow = {
    id: "job_abc123",
    user_id: "user-1",
    type: "image",
    model: "flux-2",
    prompt: image.prompt,
    params: image,
    cost: 8,
    status: "complete",
    provider: "pollinations",
    results: [{ media: { url: "https://x.supabase.co/storage/v1/object/public/generations/a.jpg" } }],
    error: null,
    due_at: new Date(NOW).toISOString(),
    created_at: new Date(NOW).toISOString(),
    completed_at: new Date(NOW).toISOString(),
  };

  it("shows a finished job fully revealed", () => {
    const job = rowToJob(row);
    expect(job).toMatchObject({ status: "complete", stage: "complete", progress: 100, revealedCount: 1, cost: 8 });
    expect(job.createdAt).toBe(NOW);
  });

  it("hides results of a job that isn't complete", () => {
    const job = rowToJob({ ...row, status: "failed", error: "worker_timeout" });
    expect(job.results).toEqual([]);
    expect(job.error).toBe("worker_timeout");
  });
});
