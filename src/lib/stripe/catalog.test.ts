import { describe, expect, it } from "vitest";
import { PLANS } from "@/data/pricing";
import {
  PURCHASABLE_PACKS,
  getPack,
  packLookupKey,
  parsePlanLookupKey,
  planCreditsForInvoice,
  planLookupKey,
  planUnitAmount,
} from "@/lib/stripe/catalog";

describe("stripe catalog", () => {
  it("round-trips every plan lookup key", () => {
    for (const plan of PLANS) {
      for (const interval of ["monthly", "annual"] as const) {
        expect(parsePlanLookupKey(planLookupKey(plan.id, interval))).toEqual({ planId: plan.id, interval });
      }
    }
  });

  it("rejects unknown or malformed lookup keys", () => {
    expect(parsePlanLookupKey("plan_platinum_monthly")).toBeNull();
    expect(parsePlanLookupKey("plan_pro_weekly")).toBeNull();
    expect(parsePlanLookupKey("pack_600")).toBeNull();
    expect(parsePlanLookupKey(null)).toBeNull();
  });

  it("bills annual plans as 12 × the discounted monthly rate", () => {
    const pro = PLANS.find((p) => p.id === "pro")!;
    expect(planUnitAmount(pro, "monthly")).toBe(2900);
    expect(planUnitAmount(pro, "annual")).toBe(23 * 12 * 100);
  });

  it("grants a month of credits per month covered, per seat", () => {
    expect(planCreditsForInvoice("pro", "monthly")).toBe(600);
    expect(planCreditsForInvoice("pro", "annual")).toBe(7200);
    expect(planCreditsForInvoice("team", "monthly", 3)).toBe(3000);
    expect(planCreditsForInvoice("nope", "monthly")).toBe(0);
  });

  it("only sells packs with a price and credits", () => {
    expect(PURCHASABLE_PACKS.map((p) => p.id)).toEqual(["pack-600", "pack-1000"]);
    expect(getPack("autorefill")).toBeUndefined();
    expect(packLookupKey("pack-600")).toBe("pack_600");
  });
});
