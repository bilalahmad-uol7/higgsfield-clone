"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { NAV, isGroup, type NavLeaf } from "@/data/nav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HiggsfieldLogo } from "@/components/ui/HiggsfieldLogo";
import { cn } from "@/lib/cn";

const EASE = [0.22, 1, 0.36, 1] as const;

function Dropdown({ label, items }: { label: string; items: NavLeaf[] }) {
  return (
    <div className="group/dd relative">
      <button className="slate flex h-14 items-center gap-1.5 px-3 text-white-70 transition-colors group-hover/dd:text-paper group-focus-within/dd:text-paper">
        {label}
        <span className="text-[8px] transition-transform group-hover/dd:rotate-180">▼</span>
      </button>
      <div className="invisible absolute left-0 top-full w-72 translate-y-1 border border-white-10 bg-ink/95 p-2 opacity-0 backdrop-blur-xl transition-all duration-200 group-focus-within/dd:visible group-focus-within/dd:translate-y-0 group-focus-within/dd:opacity-100 group-hover/dd:visible group-hover/dd:translate-y-0 group-hover/dd:opacity-100">
        {items.map((item, i) => (
          <Link
            key={item.label}
            href={item.href}
            className="group/item flex items-start gap-3 px-3 py-2.5 transition-colors hover:bg-white-6"
          >
            <span className="slate mt-1 text-white-40 group-hover/item:text-rec">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex flex-col">
              <span className="flex items-center gap-2 text-sm text-paper">
                {item.label}
                {item.badge && <Badge>{item.badge}</Badge>}
              </span>
              {item.description && <span className="text-xs text-white-40">{item.description}</span>}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Freeze the page behind the full-screen menu.
  useEffect(() => {
    if (menuOpen) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen, lenis]);

  // Over the home hero the bar is see-through; everywhere else, and once the
  // page scrolls, it becomes solid ink.
  const solid = scrolled || pathname !== "/" || menuOpen;

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 border-b transition-colors duration-500",
          solid ? "border-white-8 bg-ink/85 backdrop-blur-xl" : "border-transparent bg-transparent",
        )}
      >
        <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-6 px-4 md:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setMenuOpen(false)}>
            <HiggsfieldLogo className="h-5 w-5 text-paper" />
            <span className="display text-2xl leading-none">Higgsfield</span>
          </Link>

          <nav className="hidden items-center lg:flex">
            {NAV.map((item) =>
              isGroup(item) ? (
                <Dropdown key={item.label} label={item.label} items={item.children} />
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="slate flex h-14 items-center gap-2 px-3 text-white-70 transition-colors hover:text-paper"
                >
                  {item.label}
                  {item.badge && <span className="text-rec">{item.badge}</span>}
                </Link>
              ),
            )}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
              Log in
            </Button>
            <Button href="/signup" variant="primary" size="sm">
              Sign up
            </Button>
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="ml-1 flex h-9 w-9 items-center justify-center text-paper lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="relative block h-3 w-6">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300",
                    menuOpen && "translate-y-[6px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300",
                    menuOpen && "-translate-y-[5px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would become the containing
          block for this fixed overlay and collapse it to the bar's height. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-ink lg:hidden"
            data-lenis-prevent
          >
            <div className="flex flex-col gap-8 px-4 py-8">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.15 + i * 0.05 }}
                >
                  {isGroup(item) ? (
                    <div>
                      <p className="slate mb-2 text-white-40">{item.label}</p>
                      <div className="flex flex-col">
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            onClick={() => setMenuOpen(false)}
                            className="display flex items-center gap-3 py-1 text-4xl"
                          >
                            {child.label}
                            {child.badge && <Badge>{child.badge}</Badge>}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="display flex items-center gap-3 text-5xl"
                    >
                      {item.label}
                      {item.badge && <Badge>{item.badge}</Badge>}
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
