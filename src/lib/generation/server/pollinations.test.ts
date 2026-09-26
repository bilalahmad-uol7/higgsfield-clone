import { describe, expect, it } from "vitest";
import {
  buildPollinationsRequest,
  imageDimensions,
  isPollinationsDisabled,
  seedFor,
} from "@/lib/generation/server/pollinations";
import type { GenerationParams } from "@/lib/generation/types";

const params: GenerationParams = {
  type: "image",
  model: "flux-2",
  prompt: "a lighthouse at dusk, 35mm",
  aspectRatio: "16:9",
  quality: "1.5k",
  batchSize: 2,
};

describe("imageDimensions", () => {
  it("keeps the long edge for the quality tier and rounds to multiples of 16", () => {
    expect(imageDimensions("16:9", "1.5k")).toEqual({ width: 1024, height: 576 });
    expect(imageDimensions("9:16", "2k")).toEqual({ width: 720, height: 1280 });
    expect(imageDimensions("1:1", "4K")).toEqual({ width: 1536, height: 1536 });
  });

  it.each(["9:16", "3:4", "2:3", "1:1", "4:3", "16:9", "21:9"] as const)("%s gives valid sizes", (ratio) => {
    const { width, height } = imageDimensions(ratio, "2k");
    expect(width % 16).toBe(0);
    expect(height % 16).toBe(0);
    expect(Math.min(width, height)).toBeGreaterThanOrEqual(256);
  });
});

describe("seedFor", () => {
  it("is stable per slot and differs across slots", () => {
    expect(seedFor("job_abc123", 0)).toBe(seedFor("job_abc123", 0));
    expect(seedFor("job_abc123", 0)).not.toBe(seedFor("job_abc123", 1));
  });
});

describe("buildPollinationsRequest", () => {
  it("uses the free keyless endpoint without an API key", () => {
    const req = buildPollinationsRequest(params, 0, "job_abc123", {});
    const url = new URL(req.url);
    expect(url.origin).toBe("https://image.pollinations.ai");
    expect(decodeURIComponent(url.pathname)).toBe(`/prompt/${params.prompt}`);
    expect(url.searchParams.get("width")).toBe("1024");
    expect(url.searchParams.get("height")).toBe("576");
    expect(url.searchParams.get("safe")).toBe("true");
    expect(url.searchParams.get("nologo")).toBe("true");
    expect(url.searchParams.get("seed")).toBe(String(seedFor("job_abc123", 0)));
    expect(req.headers).toEqual({});
  });

  it("uses gen.pollinations.ai with a bearer header when keyed, never putting the key in the URL", () => {
    const req = buildPollinationsRequest(params, 1, "job_abc123", {
      POLLINATIONS_API_KEY: "sk_test_secret",
      POLLINATIONS_MODEL: "zimage",
    });
    const url = new URL(req.url);
    expect(url.origin).toBe("https://gen.pollinations.ai");
    expect(url.pathname.startsWith("/image/")).toBe(true);
    expect(url.searchParams.get("model")).toBe("zimage");
    expect(req.url).not.toContain("sk_test_secret");
    expect(req.headers.authorization).toBe("Bearer sk_test_secret");
  });

  it("defaults the keyed model to flux", () => {
    const req = buildPollinationsRequest(params, 0, "job_abc123", { POLLINATIONS_API_KEY: "sk_x" });
    expect(new URL(req.url).searchParams.get("model")).toBe("flux");
  });
});

describe("isPollinationsDisabled", () => {
  it("reads the kill switch", () => {
    expect(isPollinationsDisabled({})).toBe(false);
    expect(isPollinationsDisabled({ POLLINATIONS_DISABLED: "1" })).toBe(true);
    expect(isPollinationsDisabled({ POLLINATIONS_DISABLED: "true" })).toBe(true);
  });
});
