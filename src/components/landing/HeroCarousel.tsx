"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { HERO_SLIDES } from "@/data/landing";
import { Media } from "@/components/ui/Media";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const slide = HERO_SLIDES[index];

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % HERO_SLIDES.length), AUTOPLAY_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative mx-auto mt-4 max-w-[1400px] px-4 md:px-6">
      <div className="relative aspect-[16/8] w-full overflow-hidden rounded-2xl bg-surface-tertiary sm:aspect-[16/6]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.title}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Media media={slide.media} alt={slide.title} sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-5 sm:p-8">
              <h2 className="hf-heading text-xl font-medium text-white sm:text-3xl">{slide.title}</h2>
              <p className="max-w-lg text-sm text-white-80 sm:text-base">{slide.tagline}</p>
              <Link
                href={slide.href}
                className="mt-2 inline-flex w-fit items-center rounded-pill bg-white px-4 py-2 text-sm font-medium text-black shadow-[0_9px_22px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.02]"
              >
                {slide.cta}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        <button
          aria-label="Previous slide"
          onClick={() => setIndex((i) => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 sm:flex"
        >
          <ChevronLeft size={18} />
        </button>
        <button
          aria-label="Next slide"
          onClick={() => setIndex((i) => (i + 1) % HERO_SLIDES.length)}
          className="absolute right-3 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 sm:flex"
        >
          <ChevronRight size={18} />
        </button>

        <div className="absolute right-4 top-4 flex gap-1.5">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.title}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-pill transition-all ${
                i === index ? "w-6 bg-lime" : "w-1.5 bg-white-40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
