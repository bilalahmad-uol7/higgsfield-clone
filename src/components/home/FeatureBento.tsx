import Link from "next/link";
import { FEATURES } from "@/data/home";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHead } from "@/components/layout/SectionHead";
import { cn } from "@/lib/cn";

// Asymmetric 6-column bento: one hero tile, then a mosaic of smaller ones.
const SPAN = [
  "md:col-span-4 md:row-span-2 min-h-[420px] md:min-h-[560px]",
  "md:col-span-2 min-h-[270px]",
  "md:col-span-2 min-h-[270px]",
  "md:col-span-2 min-h-[300px]",
  "md:col-span-2 min-h-[300px]",
  "md:col-span-2 min-h-[300px]",
];

export function FeatureBento() {
  return (
    <section className="mx-auto max-w-[1440px] px-4 py-28 md:px-8 md:py-40">
      <SectionHead
        scene={4}
        label="The toolkit"
        title={
          <>
            Every tool <em>on set.</em>
          </>
        }
        aside="Video, image, audio and agents — the whole production pipeline behind one login. Hover to roll camera."
      />

      <div className="mt-14 grid grid-cols-1 gap-3 md:grid-cols-6">
        {FEATURES.map((tile, i) => (
          <Reveal key={tile.name} delay={(i % 3) * 0.08} className={cn("relative", SPAN[i])}>
            <Link
              href={tile.href}
              className="group absolute inset-0 overflow-hidden border border-white-8 bg-ink-raised"
            >
              <Media
                media={tile.media}
                alt={tile.name}
                className="noir-media transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
              <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
                <span className="slate text-paper/70">
                  {String(i + 1).padStart(2, "0")} / {tile.kicker}
                </span>
                {tile.badge && <span className="slate bg-rec px-1.5 py-1 text-ink">{tile.badge}</span>}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                <div>
                  <h3 className={cn("display", i === 0 ? "text-5xl md:text-7xl" : "text-3xl md:text-4xl")}>
                    {tile.name}
                  </h3>
                  <p className="mt-1 text-sm text-white-60">{tile.description}</p>
                </div>
                <span className="slate shrink-0 translate-x-2 text-rec opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                  Open →
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
