import { describe, expect, it, vi } from "vitest";
import { executeImageJob, providerFor, type ImageJobDeps } from "@/lib/generation/server/image-job";
import type { GenerationParams } from "@/lib/generation/types";

const params: GenerationParams = {
  type: "image",
  model: "flux-2",
  prompt: "neon alley in the rain",
  aspectRatio: "3:4",
  quality: "1.5k",
  batchSize: 2,
};
const IMAGE = { bytes: new Uint8Array([1, 2, 3]), contentType: "image/jpeg" };

function deps(overrides: Partial<ImageJobDeps> = {}): ImageJobDeps {
  return {
    disabled: false,
    now: () => 0,
    generate: vi.fn(async () => IMAGE),
    upload: vi.fn(async (i: number) => ({ path: `u/j/${i}.jpg`, url: `https://s/u/j/${i}.jpg` })),
    remove: vi.fn(async () => {}),
    isRunning: vi.fn(async () => true),
    finish: vi.fn(async () => true),
    fail: vi.fn(async () => {}),
    ...overrides,
  };
}

const DEADLINE = 180_000;

describe("providerFor", () => {
  it("labels full, partial and total fallback", () => {
    expect(providerFor(0, 2)).toBe("pollinations");
    expect(providerFor(1, 2)).toBe("pollinations+fallback");
    expect(providerFor(2, 2)).toBe("mock-fallback");
  });
});

describe("executeImageJob", () => {
  it("stores every generated image and completes the job", async () => {
    const d = deps();
    await expect(executeImageJob(params, DEADLINE, d)).resolves.toBe("complete");
    expect(d.upload).toHaveBeenCalledTimes(2);
    expect(d.finish).toHaveBeenCalledWith(
      [{ media: { url: "https://s/u/j/0.jpg" } }, { media: { url: "https://s/u/j/1.jpg" } }],
      "pollinations",
    );
    expect(d.fail).not.toHaveBeenCalled();
  });

  it("falls back to a demo sample for a slot Pollinations can't serve", async () => {
    const generate = vi.fn().mockResolvedValueOnce(IMAGE).mockRejectedValueOnce(new Error("pollinations_http_502"));
    const d = deps({ generate });
    await expect(executeImageJob(params, DEADLINE, d)).resolves.toBe("complete");
    const [results, provider] = vi.mocked(d.finish).mock.calls[0];
    expect(provider).toBe("pollinations+fallback");
    expect(results[0]).toEqual({ media: { url: "https://s/u/j/0.jpg" } });
    expect(results[1].fallback).toBe(true);
    expect(results[1].media.url).toBeUndefined();
    expect(d.fail).not.toHaveBeenCalled();
  });

  it("uses samples for every slot when Pollinations is disabled", async () => {
    const d = deps({ disabled: true });
    await expect(executeImageJob(params, DEADLINE, d)).resolves.toBe("complete");
    expect(d.generate).not.toHaveBeenCalled();
    expect(vi.mocked(d.finish).mock.calls[0][1]).toBe("mock-fallback");
  });

  it("uses samples instead of starting a call when the budget is spent", async () => {
    const d = deps({ now: () => DEADLINE - 1_000 });
    await executeImageJob(params, DEADLINE, d);
    expect(d.generate).not.toHaveBeenCalled();
    expect(vi.mocked(d.finish).mock.calls[0][1]).toBe("mock-fallback");
  });

  it("fails (refunds) the job and cleans up when storage breaks", async () => {
    const upload = vi
      .fn()
      .mockResolvedValueOnce({ path: "u/j/0.jpg", url: "https://s/u/j/0.jpg" })
      .mockRejectedValueOnce(new Error("storage_upload_failed: boom"));
    const d = deps({ upload });
    await expect(executeImageJob(params, DEADLINE, d)).resolves.toBe("failed");
    expect(d.fail).toHaveBeenCalledWith("storage_upload_failed: boom");
    expect(d.remove).toHaveBeenCalledWith(["u/j/0.jpg"]);
    expect(d.finish).not.toHaveBeenCalled();
  });

  it("stops and discards uploads when the job is cancelled mid-batch", async () => {
    const d = deps({ isRunning: vi.fn(async () => false) });
    await expect(executeImageJob(params, DEADLINE, d)).resolves.toBe("stopped");
    expect(d.upload).toHaveBeenCalledTimes(1);
    expect(d.remove).toHaveBeenCalledWith(["u/j/0.jpg"]);
    expect(d.finish).not.toHaveBeenCalled();
  });

  it("discards uploads when the job was cancelled just before finishing", async () => {
    const d = deps({ finish: vi.fn(async () => false) });
    await expect(executeImageJob(params, DEADLINE, d)).resolves.toBe("stopped");
    expect(d.remove).toHaveBeenCalledWith(["u/j/0.jpg", "u/j/1.jpg"]);
  });
});
