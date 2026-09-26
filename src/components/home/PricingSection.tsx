import Link from "next/link";
import { Suspense } from "react";
import { PricingCards } from "@/components/pricing/PricingCards";
import { getSessionProfile } from "@/lib/auth/session";
import { billingStateOf } from "@/lib/stripe/billing-state";
import { SectionHead } from "@/components/layout/SectionHead";

// Plan state (current plan / switch buttons) depends on the session; stream
// it in so the rest of the page never waits on the profile query. The
// fallback is the same cards in their signed-out state, so nothing shifts.
async function CardsWithBilling() {
  return <PricingCards billing={billingStateOf(await getSessionProfile())} />;
}

export function PricingSection() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-28 md:px-8 md:py-40">
      <SectionHead
        scene={5}
        label="Rates"
        title={
          <>
            Pick your <em>crew size.</em>
          </>
        }
        aside={
          <>
            One credit balance across every model.{" "}
            <Link href="/pricing" className="text-paper underline decoration-rec underline-offset-4">
              Credit packs &amp; enterprise →
            </Link>
          </>
        }
      />
      <div className="mt-14">
        <Suspense fallback={<PricingCards billing={null} />}>
          <CardsWithBilling />
        </Suspense>
      </div>
    </section>
  );
}
