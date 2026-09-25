"use client";

import { useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useMotionValueEvent } from "framer-motion";
import { HOW_IT_WORKS, STAGE_NAME } from "@/data/home";
import { JOB_STAGES } from "@/lib/generation/types";
import { mediaUrl } from "@/lib/media";
import { Button } from "@/components/ui/Button";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Viewfinder } from "@/components/motion/Viewfinder";
import { useCinematic, usePinProgress, useScrub } from "@/components/motion/usePin";
import { SectionHead } from "@/components/home/SectionHead";
import { cn } from "@/lib/cn";

const { prompt, moves, steps } = HOW_IT_WORKS;

// Scroll budget: 0–0.34 types the prompt, 0.34–0.6 lights camera moves,
// 0.6–0.95 renders through the real pipeline stages.
const TYPE = [0.03, 0.3];
const MOVE_AT = [0.38, 0.45, 0.52];
const RENDER = [0.6, 0.94];

// SET PIECE #3 — the product demo. Scrolling literally writes the prompt,
// directs the camera and renders the shot.
export function HowItWorks() {
  const cinematic = useCinematic();
  const { ref, progress } = usePinProgress<HTMLElement>();
  const done = useMotionValue(1);
  const p = cinematic ? progress : done;

  const [p0, setP0] = useState(cinematic ? 0 : 1);
  useMotionValueEvent(p, "change", setP0);
  const value = cinematic ? p0 : 1;

  const chars = Math.round(Math.min(1, Math.max(0, (value - TYPE[0]) / (TYPE[1] - TYPE[0]))) * prompt.length);
  const render = Math.min(1, Math.max(0, (value - RENDER[0]) / (RENDER[1] - RENDER[0])));
  const stageIndex = value < RENDER[0] ? -1 : Math.min(JOB_STAGES.length - 1, Math.floor(render * JOB_STAGES.length));
  const step = value < 0.34 ? 0 : value < RENDER[0] ? 1 : 2;

  const blur = useScrub(p, RENDER, [18, 0]);
  const gray = useScrub(p, RENDER, [1, 0]);
  const filter = useMotionTemplate`blur(${blur}px) grayscale(${gray})`;
  const scale = useScrub(p, RENDER, [1.15, 1]);
  const railScale = useScrub(p, [0, 0.95], [0, 1]);
  const barScale = useScrub(p, RENDER, [0, 1]);

  return (
    <section ref={ref} className="relative md:h-[380vh]">
      <div className="py-24 md:sticky md:top-0 md:flex md:h-svh md:items-center md:overflow-hidden md:pb-4 md:pt-18">
        <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:px-8">
          <div className="flex flex-col justify-center">
            <SectionHead
              scene={3}
              label="How it works"
              title={
                <>
                  Three takes.
                  <br />
                  <em>One shot.</em>
                </>
              }
            />
            <ol className="relative mt-8 flex flex-col gap-5 pl-8">
              <span className="absolute bottom-2 left-0 top-2 w-px bg-white-10">
                <motion.span className="block h-full w-full origin-top bg-rec" style={{ scaleY: railScale }} />
              </span>
              {steps.map((s, i) => (
                <li
                  key={s.title}
                  className={cn("transition-opacity duration-500", i === step || !cinematic ? "opacity-100" : "opacity-35")}
                >
                  <p className="slate text-white-40">
                    <span className={i <= step ? "text-rec" : undefined}>{String(i + 1).padStart(2, "0")}</span> / {s.title}
                  </p>
                  <p className="mt-2 max-w-sm text-sm text-white-70">{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8">
              <Button href={`/create?type=video&prompt=${encodeURIComponent(prompt)}`} variant="outline">
                Try this prompt →
              </Button>
            </div>
          </div>

          {/* The director's monitor */}
          <div className="flex flex-col border border-white-10 bg-ink-raised">
            <div className="flex items-center justify-between border-b border-white-10 px-4 py-3">
              <span className="slate text-white-40">Monitor A · Seedance 2.5</span>
              <span className="slate flex items-center gap-2 text-white-60">
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    stageIndex >= 0 && stageIndex < JOB_STAGES.length - 1 ? "animate-rec bg-rec" : "bg-white-24",
                  )}
                />
                {stageIndex >= 0 ? STAGE_NAME[JOB_STAGES[stageIndex]] : "Standby"}
              </span>
            </div>

            <div className="relative aspect-video overflow-hidden bg-ink md:aspect-auto md:h-[min(46svh,32vw)]">
              <motion.div className="absolute inset-0" style={{ filter, scale }}>
                <LazyVideo src={mediaUrl(HOW_IT_WORKS.media)} />
              </motion.div>
              <div
                className={cn(
                  "absolute inset-0 flex items-center justify-center bg-ink/80 transition-opacity duration-500",
                  stageIndex >= 0 ? "opacity-0" : "opacity-100",
                )}
              >
                <p className="slate text-white-40">No signal — waiting for direction</p>
              </div>
              <Viewfinder inset="inset-3" label={stageIndex === JOB_STAGES.length - 1 ? "4K · 24fps" : undefined} />
            </div>

            <div className="h-0.5 bg-white-8">
              <motion.div className="h-full origin-left bg-rec" style={{ scaleX: barScale }} />
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-[1fr_auto]">
              <div>
                <p className="slate text-white-40">Prompt</p>
                <p className="mt-2 min-h-[3lh] text-sm leading-relaxed text-paper md:text-base">
                  {prompt.slice(0, chars)}
                  <span
                    className={cn(
                      "ml-0.5 inline-block h-[1.1em] w-px translate-y-[0.2em] bg-rec",
                      chars < prompt.length && "animate-rec",
                    )}
                  />
                </p>
              </div>
              <div>
                <p className="slate text-white-40">Camera</p>
                <div className="mt-2 flex flex-wrap gap-2 md:flex-col">
                  {moves.map((m, i) => {
                    const on = value >= MOVE_AT[i];
                    return (
                      <span
                        key={m}
                        className={cn(
                          "slate border px-2.5 py-1.5 transition-colors duration-300",
                          on ? "border-rec bg-rec text-ink" : "border-white-16 text-white-40",
                        )}
                      >
                        {m}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
