"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { HERO } from "@/data/home";
import { mediaUrl } from "@/lib/media";
import { Button } from "@/components/ui/Button";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { Viewfinder } from "@/components/motion/Viewfinder";
import { useCinematic, usePinProgress, useScrub } from "@/components/motion/usePin";

const EASE = [0.22, 1, 0.36, 1] as const;

// Ambient glow behind the framed shot: mirrors the playing video into a tiny
// canvas ~12×/s and lets CSS blur it up. Costs one small drawImage instead of
// a second full-res <video> (which would double-download the clip).
function useAmbientCanvas(source: React.RefObject<HTMLElement | null>) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 80) return;
      last = t;
      const video = source.current?.querySelector("video");
      if (video && video.readyState >= 2) ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [source]);
  return canvas;
}

// SET PIECE #1 — a full-bleed black & white shot that, as you scroll, pulls
// back into a framed 16:9 monitor and blooms into color.
export function HeroReel() {
  const cinematic = useCinematic();
  const { ref, progress } = usePinProgress<HTMLElement>();
  const still = useMotionValue(0);
  const p = cinematic ? progress : still;

  const insetY = useScrub(p, [0, 0.7], [0, 13]);
  const insetX = useScrub(p, [0, 0.7], [0, 9]);
  const radius = useScrub(p, [0, 0.7], [0, 6]);
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${radius}px)`;
  const gray = useScrub(p, [0.25, 0.75], [1, 0]);
  const filter = useMotionTemplate`grayscale(${gray}) contrast(1.05)`;
  const videoScale = useScrub(p, [0, 0.7], [1.08, 1]);

  const copyY = useScrub(p, [0, 0.45], ["0%", "-30%"]);
  const copyOpacity = useScrub(p, [0, 0.4], [1, 0]);
  const captionOpacity = useScrub(p, [0.6, 0.85], [0, 1]);
  const glowOpacity = useScrub(p, [0.2, 0.7], [0, 0.55]);

  const src = mediaUrl(HERO.media);
  const shot = useRef<HTMLDivElement>(null);
  const glow = useAmbientCanvas(shot);

  return (
    <section ref={ref} className="relative -mt-14 h-svh md:h-[210vh]" aria-label="Higgsfield — direct anything">
      <div className="sticky top-0 h-svh overflow-hidden bg-ink">
        {/* Backdrop: the same shot, heavily blurred, glowing behind the frame
            once it pulls back. */}
        <motion.canvas
          ref={glow}
          aria-hidden
          width={48}
          height={20}
          className="absolute inset-0 h-full w-full scale-110 blur-3xl"
          style={{ opacity: glowOpacity }}
        />

        <motion.div className="absolute inset-0 overflow-hidden" style={{ clipPath }}>
          <motion.div ref={shot} className="absolute inset-0" style={{ scale: videoScale, filter }}>
            <LazyVideo src={src} eager />
          </motion.div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.75)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <Viewfinder rec label="Sc.01 · Tk.04 · 24fps" inset="inset-5 top-20 md:inset-8 md:top-20" />

          {/* Letterbox bars drop in on load, like the film starting. */}
          <motion.div
            aria-hidden
            className="absolute inset-x-0 top-0 bg-ink"
            initial={{ height: "50%" }}
            animate={{ height: "0%" }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
          />
          <motion.div
            aria-hidden
            className="absolute inset-x-0 bottom-0 bg-ink"
            initial={{ height: "50%" }}
            animate={{ height: "0%" }}
            transition={{ duration: 1.4, ease: EASE, delay: 0.1 }}
          />
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 mx-auto max-w-[1440px] px-4 pb-12 md:px-8 md:pb-16"
          style={{ y: copyY, opacity: copyOpacity }}
        >
          <motion.p
            className="slate text-paper/70"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
          >
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-rec align-middle" />
            {HERO.kicker}
          </motion.p>
          <h1 className="display mt-4 text-[clamp(3.25rem,11vw,11.5rem)]">
            {[HERO.line1, HERO.line2].map((line, i) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={i === 1 ? "block italic text-paper/80" : "block"}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, ease: EASE, delay: 0.55 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.div
            className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 1.1 }}
          >
            <p className="max-w-md text-base text-paper/70">{HERO.sub}</p>
            <div className="flex flex-wrap gap-3">
              <Button href={HERO.cta.href} variant="primary" size="lg">
                {HERO.cta.label} →
              </Button>
              <Button href={HERO.secondary.href} variant="outline" size="lg">
                {HERO.secondary.label}
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {cinematic && (
          <motion.div
            className="absolute inset-x-0 bottom-[5%] flex justify-center"
            style={{ opacity: captionOpacity }}
          >
            <p className="slate text-white-60">Same prompt · now in color · keep scrolling ↓</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
