import { HeroCarousel } from "@/components/landing/HeroCarousel";
import { PromoBar } from "@/components/landing/PromoBar";
import { ModelTiles } from "@/components/landing/ModelTiles";
import { McpSection } from "@/components/landing/McpSection";
import { EffectsGrid } from "@/components/landing/EffectsGrid";
import { GenjutsuSection } from "@/components/landing/GenjutsuSection";
import { ProjectsShowcase } from "@/components/landing/ProjectsShowcase";
import { SupercomputerCta } from "@/components/landing/SupercomputerCta";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <PromoBar />
      <ModelTiles />
      <McpSection />
      <EffectsGrid />
      <GenjutsuSection />
      <ProjectsShowcase />
      <SupercomputerCta />
    </>
  );
}
