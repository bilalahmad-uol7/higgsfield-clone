"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import { transform, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * Scroll progress (0→1) through a tall "pinned" section: 0 when its top hits
 * the viewport top, 1 when its bottom reaches the viewport bottom. Pair with a
 * `sticky top-0 h-svh` child so the stage stays put while progress scrubs.
 */
export function usePinProgress<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  return { ref, progress: scrollYProgress };
}

function subscribe(query: string) {
  return (onChange: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  };
}

/** SSR-safe media query; renders `fallback` on the server and first paint. */
export function useMediaQuery(query: string, fallback = false) {
  const sub = useMemo(() => subscribe(query), [query]);
  return useSyncExternalStore(
    sub,
    () => window.matchMedia(query).matches,
    () => fallback,
  );
}

/**
 * Whether scroll-scrubbed set pieces should run: desktop-ish width and the
 * user hasn't asked for reduced motion. Otherwise sections fall back to a
 * static, stacked layout.
 */
export function useCinematic() {
  const wide = useMediaQuery("(min-width: 768px)", true);
  const reduce = usePrefersReducedMotion();
  return wide && !reduce;
}

/**
 * Hydration-safe reduced-motion flag. framer's useReducedMotion reads the
 * media query during the first client render, so SSR markup and hydration
 * disagree for reduced-motion users; this reports `false` until hydrated.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}

/**
 * Map scroll progress onto an output range. Deliberately uses a *function*
 * transform: framer-motion hands plain range transforms of scroll values to a
 * native ViewTimeline for acceleration, and that timeline mis-measures ranges
 * inside a sticky pin (e.g. opacity never fading). Function transforms stay on
 * the JS path and track `progress` exactly.
 */
export function useScrub<T>(progress: MotionValue<number>, input: number[], output: T[]) {
  const map = transform(input, output);
  return useTransform(progress, (v) => map(v));
}
