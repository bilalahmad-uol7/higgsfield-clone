import { STUDIOS, type StudioMark } from "@/data/home";
import { Marquee } from "@/components/motion/Marquee";
import { cn } from "@/lib/cn";

const STYLE: Record<StudioMark["style"], string> = {
  serif: "display text-4xl md:text-5xl",
  "serif-italic": "display italic text-4xl md:text-5xl",
  mono: "font-mono text-xl md:text-2xl tracking-[0.2em]",
  sans: "font-sans text-2xl md:text-3xl font-semibold tracking-tight",
  condensed: "font-sans text-2xl md:text-3xl font-black uppercase tracking-[-0.04em] scale-x-75",
};

function Mark({ studio }: { studio: StudioMark }) {
  return (
    <span className="flex items-center">
      <span
        className={cn(
          "whitespace-nowrap px-8 text-white-40 transition-colors duration-300 hover:text-paper md:px-12",
          STYLE[studio.style],
        )}
      >
        {studio.name}
      </span>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white-16" />
    </span>
  );
}

export function StudioMarquee() {
  const half = Math.ceil(STUDIOS.length / 2);
  return (
    <section className="border-y border-white-8 py-14" aria-label="Studios creating with Higgsfield">
      <p className="slate mb-10 text-center text-white-40">On set with studios, agencies &amp; independent directors</p>
      <div className="flex flex-col gap-8">
        <Marquee duration={45}>
          {STUDIOS.slice(0, half).map((s) => (
            <Mark key={s.name} studio={s} />
          ))}
        </Marquee>
        <Marquee duration={55} reverse>
          {STUDIOS.slice(half).map((s) => (
            <Mark key={s.name} studio={s} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
