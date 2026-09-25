import Link from "next/link";
import { PricingCards } from "@/components/pricing/PricingCards";
import { SectionHead } from "@/components/layout/SectionHead";

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
        <PricingCards />
      </div>
    </section>
  );
}
