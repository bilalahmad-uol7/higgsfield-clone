"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const FPS = 24;

function format(ms: number) {
  const totalFrames = Math.floor((ms / 1000) * FPS);
  const f = totalFrames % FPS;
  const s = Math.floor(totalFrames / FPS) % 60;
  const m = Math.floor(totalFrames / FPS / 60) % 60;
  const h = Math.floor(totalFrames / FPS / 3600);
  return [h, m, s, f].map((n) => String(n).padStart(2, "0")).join(":");
}

// SMPTE-style running timecode (HH:MM:SS:FF @ 24fps). Writes straight to the
// DOM instead of through state so it never re-renders React.
export function Timecode({
  running = true,
  startAt,
  className,
}: {
  running?: boolean;
  /** epoch ms the clock counts from; defaults to mount time */
  startAt?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const origin = startAt ?? Date.now();
    let text = "";
    const tick = () => {
      const next = format(Date.now() - origin);
      // Only touch the DOM when the frame number changes (24×/s, not 60).
      if (next !== text) el.textContent = text = next;
    };
    tick();
    if (!running) return;

    // Only run while on screen: the footer and every viewfinder carry one.
    let raf = 0;
    const loop = () => {
      tick();
      raf = requestAnimationFrame(loop);
    };
    const observer = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(loop);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [running, startAt]);

  return (
    <span ref={ref} className={cn("font-mono tabular-nums", className)}>
      00:00:00:00
    </span>
  );
}
