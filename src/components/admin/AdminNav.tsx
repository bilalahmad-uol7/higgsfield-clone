"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/transactions", label: "Transactions" },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin" className="flex gap-px border border-white-10 bg-white-10 md:w-fit">
      {LINKS.map((l) => {
        const active = l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "slate flex-1 px-4 py-3 text-center transition-colors md:flex-none",
              active ? "bg-paper text-ink" : "bg-ink text-white-60 hover:bg-ink-raised hover:text-paper",
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
