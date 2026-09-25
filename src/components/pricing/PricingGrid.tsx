import { ENTERPRISE, CREDIT_PACKS } from "@/data/pricing";
import { Button } from "@/components/ui/Button";
import { PricingCards } from "@/components/pricing/PricingCards";

export function PricingGrid() {
  return (
    <div>
      <PricingCards />

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
