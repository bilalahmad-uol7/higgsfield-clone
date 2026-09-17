import { GENJUTSU_SECTION, SEEDANCE_SECTION } from "@/data/landing";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function GenjutsuSection() {
  return (
    <section className="mx-auto mt-14 max-w-[1400px] px-4 md:px-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col justify-between rounded-2xl border border-white-8 bg-surface-primary p-6 sm:p-8">
          <div>
            <Badge tone="lime">{GENJUTSU_SECTION.eyebrow}</Badge>
            <h2 className="hf-heading mt-4 text-2xl font-medium sm:text-3xl">{GENJUTSU_SECTION.title}</h2>
            <p className="mt-3 text-sm text-white-60 sm:text-base">{GENJUTSU_SECTION.description}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/create?type=video&model=genjutsu" variant="lime">
              Start generating
            </Button>
            <Button href="/create?type=video&model=genjutsu" variant="outline">
              Learn more
            </Button>
          </div>
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl bg-surface-tertiary">
            <Media media={GENJUTSU_SECTION.media} alt="Higgsfield Genjutsu" />
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-white-8 bg-surface-primary p-6 sm:p-8">
          <div>
            <h2 className="hf-heading text-2xl font-medium sm:text-3xl">{SEEDANCE_SECTION.title}</h2>
            <p className="mt-3 text-sm text-white-60 sm:text-base">{SEEDANCE_SECTION.description}</p>
          </div>
          <Button href="/create?type=video&model=seedance-2.5" variant="outline" className="mt-6 w-fit">
            {SEEDANCE_SECTION.cta}
          </Button>
          <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-xl bg-surface-tertiary">
            <Media media={SEEDANCE_SECTION.media} alt="Seedance 2.5" />
          </div>
        </div>
      </div>
    </section>
  );
}
