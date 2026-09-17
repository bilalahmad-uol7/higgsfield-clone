"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { NAV, NAV_RIGHT } from "@/data/nav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white-8 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-13 max-w-[1400px] items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="hf-heading text-lg font-semibold tracking-tight">
            Higgsfield
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" onMouseLeave={() => setOpenGroup(null)}>
            {NAV.map((group) => (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => group.items && setOpenGroup(group.label)}
              >
                <Link
                  href={group.href ?? "#"}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-white-80 transition-colors hover:bg-white-6 hover:text-white"
                >
                  {group.label}
                  {group.items && <ChevronDown size={14} className="opacity-60" />}
                </Link>

                {group.items && openGroup === group.label && (
                  <div className="absolute left-0 top-full pt-2">
                    <div className="w-80 rounded-2xl border border-white-10 bg-surface-primary p-2 shadow-2xl">
                      {group.items.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-white-6"
                        >
                          <span>
                            <span className="flex items-center gap-2 text-sm font-medium text-white-90">
                              {item.label}
                              {item.badge && <Badge tone="lime">{item.badge}</Badge>}
                            </span>
                            {item.description && (
                              <span className="mt-0.5 block text-xs text-white-60">
                                {item.description}
                              </span>
                            )}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_RIGHT.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-white-80 transition-colors hover:bg-white-6 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Button href="/login" variant="ghost" size="sm" className="hidden sm:inline-flex">
            Login
          </Button>
          <Button href="/signup" variant="lime" size="sm">
            Sign up
          </Button>
          <button
            aria-label="Toggle menu"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-white-90 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="relative block h-4 w-5">
              <span
                className={cn(
                  "absolute inset-x-0 top-0 h-px bg-current transition-transform",
                  mobileOpen && "translate-y-[7px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 h-px bg-current transition-transform",
                  mobileOpen && "-translate-y-[7px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-white-8 px-4 py-3 lg:hidden">
          {NAV.map((group) => (
            <div key={group.label} className="py-2">
              <p className="px-1 text-xs font-medium uppercase tracking-wide text-white-40">
                {group.label}
              </p>
              <div className="mt-1 flex flex-col">
                {(group.items ?? [{ label: group.label, href: group.href ?? "#" }]).map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-white-80 hover:bg-white-6"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                    {"badge" in item && item.badge && <Badge tone="lime">{item.badge}</Badge>}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2 flex flex-col gap-1 border-t border-white-8 pt-2">
            {NAV_RIGHT.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-2 py-2 text-sm text-white-80 hover:bg-white-6"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
