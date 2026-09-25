"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { REEL, type ReelFrame } from "@/data/home";
import { mediaUrl } from "@/lib/media";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { useCinematic, usePinProgress, useScrub } from "@/components/motion/usePin";
import { SectionHead } from "@/components/home/SectionHead";
import { cn } from "@/lib/cn";

const FRAMES = REEL;

function Frame({
  frame,
  index,
  live,
  className,
}: {
  frame: ReelFrame;
  index: number;
  live: boolean;
  className?: string;
}) {
  return (
    <Link
      href={`/create?type=video&prompt=${encodeURIComponent(frame.prompt)}`}
      className={cn("group relative block shrink-0", className)}
    >
      <div
        className={cn(
          "relative aspect-[4/5] overflow-hidden bg-ink-raised transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          live ? "scale-100" : "md:scale-[0.86]",
        )}
      >
        <LazyVideo src={mediaUrl(frame.media)} className={cn("noir-media", live && "is-live")} />
        <div
          className={cn(
            "absolute inset-0 bg-ink/50 transition-opacity duration-700",
            live ? "opacity-0" : "opacity-100 group-hover:opacity-0",
          )}
        />
        <span className="slate absolute left-3 top-3 text-paper/80">F.{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className={cn("display text-2xl transition-colors", live ? "text-paper" : "text-white-40")}>{frame.title}</p>
        <p className="slate text-white-40">{frame.meta}</p>
      </div>
    </Link>
  );
}

// SET PIECE #2 — vertical scroll drives a horizontal film strip. The frame
// passing the gate is in focus (and in color); the rest wait in grayscale.
export function ReelStrip() {
  const cinematic = useCinematic();
  const { ref, progress } = usePinProgress<HTMLElement>();
  const still = useMotionValue(0);
  const p = cinematic ? progress : still;
  const [active, setActive] = useState(0);

  // Hold the strip for a beat at each end so the first & last frames land.
  const travel = useScrub(p, [0.08, 0.92], [0, 1]);
  useMotionValueEvent(travel, "change", (v) => setActive(Math.round(v * (FRAMES.length - 1))));

  return (
    <section id="reel" ref={ref} className="relative md:h-[360vh]">
      <div className="flex flex-col justify-center py-24 md:sticky md:top-0 md:h-svh md:overflow-hidden md:pb-4 md:pt-18">
        <div className="mx-auto w-full max-w-[1440px] px-4 md:px-8">
          <SectionHead
            scene={2}
            label="The reel"
            title={
              <>
                Made on <em>Higgsfield.</em>
              </>
            }
            aside="Shots from the community and the Higgsfield team. Tap any frame to open its prompt in the studio."
          />
        </div>

        {cinematic ? (
          <div className="sprockets relative mt-8 bg-ink-raised py-7">
            <motion.div
              className="flex w-max gap-6 px-[calc(50vw_-_min(12vw,19svh))] [transform:translateX(calc(var(--p)*(100vw_-_100%)))]"
              style={{ "--p": travel } as never}
            >
              {FRAMES.map((frame, i) => (
                <Frame key={frame.title} frame={frame} index={i} live={i === active} className="w-[min(24vw,38svh)]" />
              ))}
            </motion.div>
          </div>
        ) : (
          <div className="sprockets mt-10 bg-ink-raised py-8">
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 [scrollbar-width:none]" data-lenis-prevent>
              {FRAMES.map((frame, i) => (
                <Frame key={frame.title} frame={frame} index={i} live={false} className="w-[72vw] snap-center sm:w-[44vw] lg:w-[26vw]" />
              ))}
            </div>
          </div>
        )}

        {cinematic && (
          <div className="mx-auto mt-6 flex w-full max-w-[1440px] items-center justify-between px-4 md:px-8">
            <p className="slate text-white-60">
              Frame <span className="text-paper">{String(active + 1).padStart(2, "0")}</span> /{" "}
              {String(FRAMES.length).padStart(2, "0")}
            </p>
            <div className="h-px w-1/3 bg-white-10">
              <motion.div className="h-full origin-left bg-rec" style={{ scaleX: travel }} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
