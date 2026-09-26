import { CREDIT_PACKS, PLANS, type CreditPack, type PricingPlan } from "@/data/pricing";

// Single source of truth tying the pricing page to Stripe. Prices are found by
// lookup key (created by `npm run stripe:seed`), so no price ids live in env.

export type Interval = "monthly" | "annual";
export const INTERVALS: Interval[] = ["monthly", "annual"];

export type PurchasablePack = CreditPack & { price: number; credits: number };

export function getPlan(id: string | null | undefined): PricingPlan | undefined {
  return PLANS.find((p) => p.id === id);
}

export function getPack(id: string | null | undefined): PurchasablePack | undefined {
  const pack = CREDIT_PACKS.find((p) => p.id === id);
  return pack && pack.price != null && pack.credits != null ? (pack as PurchasablePack) : undefined;
}

export const PURCHASABLE_PACKS = CREDIT_PACKS.filter((p) => getPack(p.id)) as PurchasablePack[];

export function isInterval(v: unknown): v is Interval {
  return v === "monthly" || v === "annual";
}

export function planLookupKey(planId: string, interval: Interval) {
  return `plan_${planId}_${interval}`;
}

export function packLookupKey(packId: string) {
  return packId.replace(/-/g, "_");
}

/** Inverse of planLookupKey, e.g. "plan_pro_annual" → { planId: "pro", interval: "annual" }. */
export function parsePlanLookupKey(key: string | null | undefined): { planId: string; interval: Interval } | null {
  const m = /^plan_([a-z0-9-]+)_(monthly|annual)$/.exec(key ?? "");
  if (!m || !getPlan(m[1])) return null;
  return { planId: m[1], interval: m[2] as Interval };
}

/** Unit amount in cents: monthly price, or the discounted per-month rate × 12 billed yearly. */
export function planUnitAmount(plan: PricingPlan, interval: Interval) {
  return interval === "monthly" ? plan.monthly * 100 : plan.annual * 12 * 100;
}

/**
 * Credits granted when a plan invoice is paid: the monthly allowance for each
 * month the invoice covers (12 for annual), per seat for Team.
 */
export function planCreditsForInvoice(planId: string, interval: Interval, quantity = 1) {
  const plan = getPlan(planId);
  if (!plan) return 0;
  return plan.credits * (interval === "annual" ? 12 : 1) * Math.max(1, quantity);
}

/** Subscription statuses that still entitle the user to their plan. */
export const ACTIVE_STATUSES = new Set(["active", "trialing", "past_due"]);
