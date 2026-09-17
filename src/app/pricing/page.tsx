import { PricingGrid } from "@/components/pricing/PricingGrid";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-14 md:px-6">
      <div className="text-center">
        <h1 className="hf-heading text-3xl font-medium sm:text-4xl">Pricing</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm text-white-60 sm:text-base">
          Credits that work across every model — image, video, and audio.
        </p>
      </div>
      <div className="mt-10">
        <PricingGrid />
      </div>
    </div>
  );
}
