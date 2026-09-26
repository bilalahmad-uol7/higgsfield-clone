"use client";

import { MotionConfig } from "framer-motion";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

// Global inertial scroll + motion defaults. Lenis honours
// prefers-reduced-motion on its own (respectReducedMotion defaults to true);
// MotionConfig makes framer skip transform animations for those users too.
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ lerp: 0.15, smoothWheel: true, anchors: true }}>
        {children}
      </ReactLenis>
    </MotionConfig>
  );
}
