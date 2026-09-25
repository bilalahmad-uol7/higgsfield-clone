"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FAQ } from "@/data/faq";
import { SectionHead } from "@/components/layout/SectionHead";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Faq({ scene = 6 }: { scene?: number }) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="mx-auto max-w-[1440px] px-4 py-28 md:px-8 md:py-40">
      <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <div className="md:sticky md:top-28 md:self-start">
          <SectionHead
            scene={scene}
            label="Questions"
            title={
              <>
                Before you <em>roll.</em>
              </>
            }
          />
          <p className="mt-6 max-w-sm text-sm text-white-60">
            Still stuck? The help center has the long answers, and a human reads every message.
          </p>
        </div>

        <ul className="border-t border-white-10">
          {FAQ.map((item, i) => {
            const isOpen = open === i;
            const panelId = `${baseId}-${i}`;
            return (
              <li key={item.q} className="border-b border-white-10">
                <button
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="group flex w-full items-start gap-5 py-6 text-left"
                >
                  <span className={cn("slate mt-2 transition-colors", isOpen ? "text-rec" : "text-white-40")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="display flex-1 text-2xl transition-colors group-hover:text-paper md:text-3xl">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "relative mt-3 h-3 w-3 shrink-0 transition-transform duration-300",
                      isOpen && "rotate-45",
                    )}
                  >
                    <span className="absolute inset-x-0 top-1/2 h-px bg-paper" />
                    <span className="absolute inset-y-0 left-1/2 w-px bg-paper" />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-7 pl-10 text-sm leading-relaxed text-white-70 md:text-base">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
