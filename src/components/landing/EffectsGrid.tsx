import Link from "next/link";
import { EFFECTS } from "@/data/landing";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";

export function EffectsGrid() {
  return (
    <section className="mx-auto mt-14 max-w-[1400px] px-4 md:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="hf-heading text-2xl font-medium sm:text-4xl">Visual Effects</h2>
          <p className="mt-2 max-w-lg text-sm text-white-60 sm:text-base">
            Big-budget visual effects, from explosions to surreal transformations.
          </p>
        </div>
        <Button href="/create?type=video" variant="lime">
          Start generating
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {EFFECTS.map((effect) => (
          <div
            key={effect.slug}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-surface-tertiary"
          >
            <Media
              media={effect.preview}
              poster={effect.poster}
              alt={effect.name}
              sizes="(min-width: 1024px) 20vw, 45vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <h3 className="absolute left-3 top-3 text-sm font-medium text-white drop-shadow">
              {effect.name}
            </h3>
            <Link
              href={`/create?type=video&preset=${effect.slug}&prompt=${encodeURIComponent(effect.name)}`}
              className="absolute bottom-3 left-3 right-3 flex items-center justify-center rounded-pill bg-white/95 py-2 text-xs font-semibold text-black opacity-0 transition-opacity group-hover:opacity-100"
            >
              Recreate
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button href="/explore?tab=effects" variant="outline">
          View all presets
        </Button>
      </div>
    </section>
  );
}
