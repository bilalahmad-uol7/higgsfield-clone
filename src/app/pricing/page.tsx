import { PricingGrid } from "@/components/pricing/PricingGrid";
import { SectionHead } from "@/components/layout/SectionHead";
import { Faq } from "@/components/layout/Faq";

export default function PricingPage() {
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
        <div className="mt-14">
          <PricingGrid />
        </div>
      </div>
      <Faq scene={2} />
    </>
  );
}
