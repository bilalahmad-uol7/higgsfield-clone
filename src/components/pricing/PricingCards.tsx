"use client";

import { useState } from "react";
import { PLANS } from "@/data/pricing";
import { planCreditsForInvoice, planUnitAmount } from "@/lib/stripe/catalog";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

export type BillingState = {
  planId: string | null;
  interval: string | null;
  /** has an active/trialing/past-due subscription */
  active: boolean;
} | null;

// Plan cards + billing toggle, shared by the landing page and /pricing.
// Each CTA posts to /api/checkout, which starts Stripe Checkout (or sends an
// existing subscriber to the portal to switch plans).
export function PricingCards({ billing = null }: { billing?: BillingState }) {
  const [annual, setAnnual] = useState(billing?.interval !== "monthly");
  const interval = annual ? "annual" : "monthly";

  return (
    <div>
      <div className="flex justify-center md:justify-start">
        <div role="radiogroup" aria-label="Billing period" className="flex border border-white-16">
          {[
            { label: "Monthly", on: !annual, set: false },
            { label: "Annual · save up to 25%", on: annual, set: true },
          ].map((opt) => (
            <button
              key={opt.label}
              role="radio"
              aria-checked={opt.on}
              onClick={() => setAnnual(opt.set)}
              className={cn(
                "slate px-4 py-3 transition-colors",
                opt.on ? "bg-paper text-ink" : "text-white-60 hover:text-paper",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-px border border-white-10 bg-white-10 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan, i) => {
          const price = annual ? plan.annual : plan.monthly;
          return (
            <Reveal
              key={plan.id}
              delay={i * 0.06}
              className={cn(
                "relative flex flex-col bg-ink p-6 md:p-8",
                plan.highlighted && "bg-ink-raised outline outline-1 -outline-offset-1 outline-rec",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="slate text-white-40">{String(i + 1).padStart(2, "0")}</span>
                {plan.highlighted && (
                  <span className="slate flex items-center gap-2 text-rec">
                    <span className="h-1.5 w-1.5 animate-rec rounded-full bg-rec" />
                    Recommended
                  </span>
                )}
              </div>
              <h3 className="display mt-6 text-4xl">{plan.name}</h3>
              <p className="mt-2 min-h-[2.5rem] text-sm text-white-60">{plan.description}</p>
              <div className="mt-8 flex items-baseline gap-2">
                <span className="display text-7xl">${price}</span>
                <span className="slate text-white-40">/ {plan.unit}</span>
              </div>
              {/* Same helpers the webhook uses to grant credits, so the card
                  always matches what a purchase actually delivers. */}
              <p className="slate mt-2 text-white-40">
                {planCreditsForInvoice(plan.id, interval).toLocaleString()} credits /{" "}
                {annual ? "year" : "month"}
                {plan.unit === "seat" && " per seat"}
              </p>
              {annual && (
                <p className="slate mt-1 text-white-24">
                  Billed ${(planUnitAmount(plan, "annual") / 100).toLocaleString()} yearly
                  {plan.unit === "seat" && " per seat"}
                </p>
              )}

              <ul className="mt-8 flex flex-1 flex-col gap-3 border-t border-white-8 pt-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm text-white-70">
                    <span className="mt-[0.55em] h-px w-3 shrink-0 bg-rec" />
                    {f}
                  </li>
                ))}
              </ul>

              {billing?.active && billing.planId === plan.id && billing.interval === interval ? (
                <p className="slate mt-8 flex h-10 items-center justify-center border border-white-16 text-white-60">
                  Current plan
                </p>
              ) : (
                <form action="/api/checkout" method="post" className="mt-8">
                  <input type="hidden" name="kind" value="plan" />
                  <input type="hidden" name="planId" value={plan.id} />
                  <input type="hidden" name="interval" value={interval} />
                  <Button type="submit" variant={plan.highlighted ? "primary" : "outline"} className="w-full">
                    {billing?.active ? "Switch plan" : plan.cta}
                  </Button>
                </form>
              )}
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
