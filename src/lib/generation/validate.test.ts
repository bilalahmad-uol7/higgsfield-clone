import { describe, expect, it } from "vitest";
import { isValidJobId, parseGenerationParams } from "@/lib/generation/validate";
import { creditCost } from "@/lib/generation/types";

const valid = {
  type: "video",
  model: "seedance-2.5",
  prompt: "  a skater at golden hour  ",
  aspectRatio: "16:9",
  quality: "4K",
  batchSize: 2,
};

describe("parseGenerationParams", () => {
  it("accepts known values and trims the prompt", () => {
    expect(parseGenerationParams(valid)).toEqual({ ...valid, prompt: "a skater at golden hour", preset: undefined });
  });

  it("drops unknown fields the client adds (e.g. a fake cost)", () => {
    const parsed = parseGenerationParams({ ...valid, cost: 0, credits: 999 });
    expect(parsed).not.toHaveProperty("cost");
    expect(creditCost(parsed!)).toBe(32);
  });

  it.each([
    [{ ...valid, type: "audio" }],
    [{ ...valid, model: "soul" }], // image model on a video job
    [{ ...valid, aspectRatio: "5:4" }],
    [{ ...valid, quality: "8K" }],
    [{ ...valid, batchSize: 0 }],
    [{ ...valid, batchSize: 5 }],
    [{ ...valid, batchSize: 1.5 }],
    [{ ...valid, prompt: "   " }],
    [{ ...valid, prompt: "x".repeat(2001) }],
    [{ ...valid, preset: "not-a-preset" }],
    [{ ...valid, type: "image", model: "soul", preset: "floating-fall" }],
    [null],
  ])("rejects invalid params %#", (input) => {
    expect(parseGenerationParams(input)).toBeNull();
  });

  it("accepts a real preset on video", () => {
    expect(parseGenerationParams({ ...valid, preset: "floating-fall" })?.preset).toBe("floating-fall");
  });
});

describe("isValidJobId", () => {
  it("accepts client job ids and rejects junk", () => {
    expect(isValidJobId("job_1727300000000_ab12cd")).toBe(true);
    expect(isValidJobId("../../etc")).toBe(false);
    expect(isValidJobId(42)).toBe(false);
  });
});
