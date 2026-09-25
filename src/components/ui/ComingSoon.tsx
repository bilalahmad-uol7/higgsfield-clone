import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import { Viewfinder } from "@/components/motion/Viewfinder";
import type { MediaRef } from "@/lib/media";

// Placeholder for products that aren't in this build yet — framed as a
// production still, "in post".
export function ComingSoon({
  title,
  description,
  media,
  cta,
}: {
  title: string;
  description: string;
  media: MediaRef;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 md:px-8">
      <div className="group relative overflow-hidden border border-white-10 bg-ink-raised">
        <div className="relative aspect-[4/5] w-full sm:aspect-[21/9]">
          <Media media={media} alt={title} sizes="1440px" className="noir-media" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
          <Viewfinder rec label="In post-production" inset="inset-4 md:inset-8" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 md:p-12">
            <p className="slate flex items-center gap-3 text-white-60">
              <span className="text-rec">Coming soon</span>
              <span className="h-px w-8 bg-white-24" />
              Not in this cut
            </p>
            <h1 className="display text-5xl sm:text-7xl lg:text-8xl">{title}</h1>
            <p className="max-w-lg text-paper/70">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={cta?.href ?? "/explore"} variant="primary" size="lg">
          {cta?.label ?? "Explore what's live"} →
        </Button>
        <Button href="/" variant="outline" size="lg">
          Back to home
        </Button>
      </div>
    </div>
  );
}
