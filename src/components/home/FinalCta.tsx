"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { FINAL_CTA } from "@/data/home";
import { mediaUrl } from "@/lib/media";
import { Button } from "@/components/ui/Button";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Viewfinder } from "@/components/motion/Viewfinder";
import { useCinematic, usePinProgress, useScrub } from "@/components/motion/usePin";

// Closing shot. The footage is only visible *through* the word "Action." —
// a black layer with white type, multiplied over the video. Scrolling pushes
// into the word and dissolves the mask until the whole frame plays in color.
export function FinalCta() {
  const cinematic = useCinematic();
  const { ref, progress } = usePinProgress<HTMLElement>();
  const still = useMotionValue(0.15);
  const p = cinematic ? progress : still;

  const wordScale = useScrub(p, [0, 0.6], [1, 1.9]);
  const maskOpacity = useScrub(p, [0.35, 0.7], [1, 0]);
  const gray = useScrub(p, [0.4, 0.75], [1, 0]);
  const filter = useMotionTemplate`grayscale(${gray})`;
  const ctaOpacity = useScrub(p, [0.65, 0.85], [0, 1]);
  const ctaY = useScrub(p, [0.65, 0.85], [30, 0]);

  return (
    <section ref={ref} className="relative md:h-[260vh]">
      <div className="relative isolate h-svh overflow-hidden bg-ink md:sticky md:top-0">
        <motion.div className="absolute inset-0" style={{ filter }}>
          <LazyVideo src={mediaUrl(FINAL_CTA.media)} />
        </motion.div>

        <motion.div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center bg-black mix-blend-multiply"
          style={{ opacity: maskOpacity }}
        >
          <motion.span className="display block text-[28vw] leading-none text-white" style={{ scale: wordScale }}>
            {FINAL_CTA.word}
          </motion.span>
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
        <Viewfinder rec label="Final take" inset="inset-5 top-20 md:inset-8 md:top-20" />

        <motion.div
          className="absolute inset-x-0 bottom-0 mx-auto flex max-w-[1440px] flex-col gap-6 px-4 pb-14 md:flex-row md:items-end md:justify-between md:px-8 md:pb-20"
          style={{ opacity: cinematic ? ctaOpacity : 1, y: cinematic ? ctaY : 0 }}
        >
          <div>
            <p className="slate text-rec">SC.07 — That&apos;s a wrap</p>
            <h2 className="display mt-4 text-5xl sm:text-6xl lg:text-8xl">{FINAL_CTA.title}</h2>
            <p className="mt-4 max-w-md text-paper/70">{FINAL_CTA.sub}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="/signup" variant="primary" size="lg">
              Start free →
            </Button>
            <Button href="/pricing" variant="outline" size="lg">
              See pricing
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
