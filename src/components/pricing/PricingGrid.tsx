"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { PLANS, ENTERPRISE, CREDIT_PACKS } from "@/data/pricing";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function PricingGrid() {
  const [annual, setAnnual] = useState(true);

  return (
    <div>
      <div className="flex justify-center">
        <div className="flex items-center gap-1 rounded-pill bg-white-6 p-1">
          <button
            onClick={() => setAnnual(false)}
            className={cn(
              "rounded-pill px-4 py-1.5 text-sm font-medium transition-colors",
              !annual ? "bg-white text-black" : "text-white-70",
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={cn(
              "rounded-pill px-4 py-1.5 text-sm font-medium transition-colors",
              annual ? "bg-white text-black" : "text-white-70",
            )}
          >
            Annual <span className={annual ? "text-black/60" : "text-lime"}>save up to 25%</span>
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {PLANS.map((plan) => {
          const price = annual ? plan.annual : plan.monthly;
          return (
            <div
              key={plan.id}
              className={cn(
                "flex flex-col rounded-2xl border p-6",
                plan.highlighted ? "border-lime bg-surface-primary" : "border-white-8 bg-surface-primary",
              )}
            >
              {plan.highlighted && (
                <span className="mb-3 w-fit rounded-pill bg-lime px-2 py-0.5 text-[11px] font-semibold uppercase text-black">
                  Most popular
                </span>
              )}
              <h3 className="hf-heading text-lg font-medium">{plan.name}</h3>
              <p className="mt-1 text-sm text-white-60">{plan.description}</p>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-semibold">${price}</span>
                <span className="text-sm text-white-40">/{plan.unit}</span>
              </div>
              <p className="mt-1 text-xs text-white-40">{plan.credits.toLocaleString()} credits</p>

              <ul className="mt-5 flex flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-white-70">
                    <Check size={14} className="mt-0.5 shrink-0 text-lime" />
                    {f}
                  </li>
                ))}
              </ul>

              <Button
                href="/signup"
                variant={plan.highlighted ? "lime" : "outline"}
                className="mt-6 w-full"
              >
                {plan.cta}
              </Button>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-white-8 bg-surface-primary p-6 text-center">
        <h3 className="hf-heading text-lg font-medium">{ENTERPRISE.name}</h3>
        <p className="mx-auto mt-1 max-w-md text-sm text-white-60">{ENTERPRISE.description}</p>
        <Button href="/pricing?plan=enterprise" variant="outline" className="mt-4">
          {ENTERPRISE.cta}
        </Button>
      </div>

      <div className="mt-10">
        <h3 className="hf-heading text-lg font-medium">Credit packs</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack) => (
            <div key={pack.id} className="rounded-xl border border-white-8 bg-surface-primary p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-white-90">{pack.label}</span>
                {"price" in pack && <span className="text-sm text-white-60">${pack.price}</span>}
              </div>
              <p className="mt-1 text-xs text-white-40">{pack.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
