import { Button } from "@/components/ui/Button";
import { Viewfinder } from "@/components/motion/Viewfinder";

// Dead air: a frame of static where the scene should be.
const STATIC = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='1' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(#s)'/></svg>`,
)}")`;

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-10 md:px-8">
      <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden border border-white-10 bg-ink sm:aspect-[21/9]">
        <div aria-hidden className="absolute -inset-[10%] animate-grain opacity-20" style={{ backgroundImage: STATIC }} />
        <Viewfinder rec label="Signal lost" inset="inset-4 md:inset-8" />
        <div className="relative text-center">
          <p className="slate text-rec">Error 404 · Scene missing</p>
          <h1 className="display mt-4 text-[clamp(4rem,14vw,12rem)]">
            Cut<em>.</em>
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-paper/70">
            This scene didn&apos;t make the final edit — or it was never shot.
          </p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href="/" variant="primary" size="lg">
          Back to home
        </Button>
        <Button href="/explore" variant="outline" size="lg">
          Explore
        </Button>
      </div>
    </div>
  );
}
