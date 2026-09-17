"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

export function LazyVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!inView || !el) return;
    // React's `muted` JSX attribute doesn't reliably sync to the DOM property
    // once `src` is applied after mount (a long-standing React quirk), so an
    // unmuted play() silently gets rejected by the browser's autoplay policy.
    // Setting it imperatively right before play() guarantees it sticks.
    el.muted = true;
    el.play().catch(() => {});
  }, [inView]);

  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      poster={poster}
      src={inView ? src : undefined}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
    />
  );
}
