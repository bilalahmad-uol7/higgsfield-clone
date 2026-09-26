import { Suspense } from "react";
import { PricingGrid } from "@/components/pricing/PricingGrid";
import { SectionHead } from "@/components/layout/SectionHead";
import { Faq } from "@/components/layout/Faq";
import { getSessionProfile } from "@/lib/auth/session";
import { billingStateOf } from "@/lib/stripe/billing-state";

const NOTICES: Record<string, string> = {
  cancelled: "Checkout cancelled — nothing was charged.",
  invalid: "That plan or pack isn't available. Pick one below.",
  error: "We couldn't reach the payment provider. Try again in a moment.",
};

// Streams plan state in (see PricingSection); fallback is the signed-out grid.
async function GridWithBilling() {
  return <PricingGrid billing={billingStateOf(await getSessionProfile())} />;
}

export default async function PricingPage({ searchParams }: PageProps<"/pricing">) {
  const { checkout } = await searchParams;
  const notice = typeof checkout === "string" ? NOTICES[checkout] : undefined;

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-16 md:px-8 md:pt-24">
        <SectionHead
          level={1}
          scene={1}
          label="Rates"
          title={
            <>
              Pay for the <em>shots,</em>
              <br />
              not the crew.
            </>
          }
          aside="Credits work across every model — image, video and audio. Switch plans or top up whenever the shoot needs it."
        />
        {notice && (
          <p role="status" className="slate mt-10 border border-white-16 px-4 py-3 text-white-70">
            {notice}
          </p>
        )}
        <div className="mt-14">
          <Suspense fallback={<PricingGrid billing={null} />}>
            <GridWithBilling />
          </Suspense>
        </div>
      </div>
      <Faq scene={2} />
    </>
  );
}
