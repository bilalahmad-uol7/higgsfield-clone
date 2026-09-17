"use client";

import Link from "next/link";
import { useState } from "react";
import { Ticket, Building2, Globe } from "lucide-react";
import { NAV_LEFT, NAV_RIGHT } from "@/data/nav";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HiggsfieldLogo } from "@/components/ui/HiggsfieldLogo";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white-8 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-13 max-w-[1400px] items-center gap-4 px-4 md:px-6">
        <Link href="/" className="hf-heading flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight">
          <HiggsfieldLogo className="h-5 w-5 text-lime" />
          <span>Higgsfield</span>
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center gap-0.5 overflow-x-auto whitespace-nowrap lg:flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {NAV_LEFT.map((item) => (
            <span key={item.label} className="flex shrink-0 items-center">
              {item.dividerBefore && <span className="mx-1.5 h-4 w-px shrink-0 bg-white-16" />}
              <Link
                href={item.href}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-white-80 transition-colors hover:bg-white-6 hover:text-white"
              >
                {item.label}
                {item.badge && (
                  <Badge tone="lime" className="text-[10px] leading-none">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </span>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1">
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_RIGHT.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm text-white-80 transition-colors hover:bg-white-6 hover:text-white"
              >
                {item.label === "Pricing" ? (
                  <Ticket size={14} className="opacity-70" />
                ) : (
                  <Building2 size={14} className="opacity-70" />
                )}
                {item.label}
                {item.badge && (
                  <Badge tone="lime" className="text-[10px] leading-none">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            ))}
            <button
              aria-label="Language"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white-70 hover:bg-white-6 hover:text-white"
            >
              <Globe size={16} />
            </button>
            <span className="mx-1 h-4 w-px bg-white-16" />
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
        <div className="flex flex-col gap-1 border-t border-white-8 px-4 py-3 lg:hidden">
          {[...NAV_LEFT, ...NAV_RIGHT].map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-white-80 hover:bg-white-6"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
              {item.badge && <Badge tone="lime">{item.badge}</Badge>}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
