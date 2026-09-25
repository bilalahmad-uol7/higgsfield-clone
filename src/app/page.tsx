import { HeroReel } from "@/components/home/HeroReel";
import { StudioMarquee } from "@/components/home/StudioMarquee";
import { ReelStrip } from "@/components/home/ReelStrip";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeatureBento } from "@/components/home/FeatureBento";
import { PricingSection } from "@/components/home/PricingSection";
import { Faq } from "@/components/home/Faq";
import { FinalCta } from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <HeroReel />
      <StudioMarquee />
      <ReelStrip />
      <HowItWorks />
      <FeatureBento />
      <PricingSection />
      <Faq />
      <FinalCta />
    </>
  );
}
