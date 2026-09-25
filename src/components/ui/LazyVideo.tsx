"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function LazyVideo({
  src,
  poster,
  className,
  eager = false,
}: {
  src: string;
  poster?: string;
  className?: string;
  /** load immediately (above-the-fold hero) instead of on approach */
  eager?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(eager);
  const [visible, setVisible] = useState(eager);

  // Attach the source once the video nears the viewport, then keep tracking
  // visibility so off-screen clips pause instead of decoding in the background.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLoaded(true);
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!loaded || !el) return;
    if (!visible) {
      el.pause();
      return;
    }
    // React's `muted` JSX attribute doesn't reliably sync to the DOM property
    // once `src` is applied after mount (a long-standing React quirk), so an
    // unmuted play() silently gets rejected by the browser's autoplay policy.
    // Setting it imperatively right before play() guarantees it sticks.
    el.muted = true;
    el.play().catch(() => {});
  }, [loaded, visible]);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      poster={poster}
      src={loaded ? src : undefined}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      aria-hidden
    />
  );
}
