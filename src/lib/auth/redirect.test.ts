import { describe, expect, it } from "vitest";
import { safeNext } from "@/lib/auth/redirect";

describe("safeNext", () => {
  it("keeps same-origin paths with their query", () => {
    expect(safeNext("/pricing")).toBe("/pricing");
    expect(safeNext("/create?type=video&prompt=a%20b")).toBe("/create?type=video&prompt=a%20b");
  });

  it.each([
    ["//evil.com", "protocol-relative"],
    ["/\\evil.com", "backslash trick"],
    ["https://evil.com", "absolute URL"],
    ["javascript:alert(1)", "script URL"],
    ["", "empty"],
  ])("rejects %s (%s)", (input) => {
    expect(safeNext(input)).toBe("/create");
  });

  it("uses the given fallback", () => {
    expect(safeNext(null, "/account")).toBe("/account");
  });
});
