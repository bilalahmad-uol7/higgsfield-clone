"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

// Scroll-into-view entrance. "rise" lifts and fades, "wipe" uncovers the
// element top-down like a shutter opening.
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: "rise" | "wipe";
  as?: "div" | "li" | "section" | "article";
}) {
  const Tag = motion[as];

  const hidden =
    variant === "wipe" ? { clipPath: "inset(0 0 100% 0)", opacity: 1 } : { y: 36, opacity: 0 };
  const shown = variant === "wipe" ? { clipPath: "inset(0 0 0% 0)", opacity: 1 } : { y: 0, opacity: 1 };

  return (
    <Tag
      className={cn(className)}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: variant === "wipe" ? 1.1 : 0.9, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
}
