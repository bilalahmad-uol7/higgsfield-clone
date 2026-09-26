import { ENTERPRISE, CREDIT_PACKS } from "@/data/pricing";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { PricingCards, type BillingState } from "@/components/pricing/PricingCards";

// Full rate card for /pricing: plans, then top-ups, then the enterprise band.
export function PricingGrid({ billing = null }: { billing?: BillingState }) {
  return (
    <div>
      <PricingCards billing={billing} />

      <div className="mt-20">
        <p className="slate text-white-40">Top-ups</p>
        <div className="mt-4 grid gap-px border border-white-10 bg-white-10 sm:grid-cols-3">
          {CREDIT_PACKS.map((pack, i) => (
            <Reveal key={pack.id} delay={i * 0.06} className="flex flex-col gap-4 bg-ink p-6">
              <div className="flex items-baseline justify-between gap-4">
                <span className="display text-3xl">{pack.label}</span>
                {pack.price != null && <span className="display text-3xl text-white-60">${pack.price}</span>}
              </div>
              <p className="text-sm text-white-60">{pack.detail}</p>
              {pack.price != null && pack.credits != null && (
                <form action="/api/checkout" method="post" className="mt-auto">
                  <input type="hidden" name="kind" value="pack" />
                  <input type="hidden" name="packId" value={pack.id} />
                  <Button type="submit" variant="outline" size="sm" className="w-full">
                    Buy {pack.credits.toLocaleString()} credits
                  </Button>
                </form>
              )}
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="relative mt-20 overflow-hidden border border-white-10 bg-ink-raised p-8 md:p-12" variant="wipe">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="slate text-rec">For studios &amp; networks</p>
            <h2 className="display mt-4 text-5xl md:text-6xl">{ENTERPRISE.name}</h2>
            <p className="mt-3 max-w-md text-white-60">{ENTERPRISE.description}</p>
          </div>
          <Button href="/pricing?plan=enterprise" variant="white" size="lg">
            {ENTERPRISE.cta} →
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
