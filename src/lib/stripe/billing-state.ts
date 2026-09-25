import type { SessionProfile } from "@/lib/auth/session";
import type { BillingState } from "@/components/pricing/PricingCards";
import { ACTIVE_STATUSES } from "@/lib/stripe/catalog";

export function billingStateOf(profile: SessionProfile | null): BillingState {
  if (!profile) return null;
  return {
    planId: profile.plan_id,
    interval: profile.plan_interval,
    active: ACTIVE_STATUSES.has(profile.subscription_status ?? ""),
  };
}
