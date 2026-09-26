"use client";

import Link from "next/link";
import { signOut } from "@/app/auth/actions";
import { useCredits, useGenerationStore } from "@/lib/generation/store";
import { useHoverMenu } from "@/components/ui/useHoverMenu";
import { cn } from "@/lib/cn";

export type Viewer = {
  name: string;
  email: string;
  avatarUrl: string | null;
  credits: number;
  isAdmin: boolean;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

// Clears this browser's local take history before the session ends, so the
// next account on the same machine starts with empty dailies.
export function SignOutButton({ className }: { className?: string }) {
  const clearJobs = useGenerationStore((s) => s.reset);
  return (
    <form action={signOut} onSubmit={() => clearJobs()}>
      <button type="submit" className={className}>
        Sign out
      </button>
    </form>
  );
}

export function Avatar({ viewer, className }: { viewer: Viewer; className?: string }) {
  return viewer.avatarUrl ? (
    // eslint-disable-next-line @next/next/no-img-element -- provider avatars come from arbitrary hosts
    <img src={viewer.avatarUrl} alt="" referrerPolicy="no-referrer" className={cn("object-cover grayscale", className)} />
  ) : (
    <span className={cn("slate flex items-center justify-center bg-paper text-ink", className)}>
      {initials(viewer.name) || "?"}
    </span>
  );
}

export function AccountMenu({ viewer }: { viewer: Viewer }) {
  // Reflects spends/refunds made in the studio without a page reload.
  const credits = useCredits(viewer.credits);
  const { open, rootProps, triggerProps, panelProps } = useHoverMenu();
  return (
    <div className="flex items-center gap-3">
      <Link href="/pricing" className="slate hidden text-white-60 transition-colors hover:text-paper sm:block">
        <span className="text-paper">{credits.toLocaleString()}</span> cr
      </Link>
      <div {...rootProps} className="relative hidden lg:block">
        <button
          aria-label="Account menu"
          aria-haspopup="menu"
          {...triggerProps}
          className={cn(
            "flex h-9 w-9 items-center justify-center overflow-hidden border transition-colors",
            open ? "border-paper" : "border-white-16",
          )}
        >
          <Avatar viewer={viewer} className="h-full w-full" />
        </button>
        <div
          {...panelProps}
          className={cn(
            "absolute right-0 top-full w-64 border border-white-10 bg-ink/95 p-2 backdrop-blur-xl transition-all duration-200",
            open ? "visible translate-y-0 opacity-100" : "invisible translate-y-1 opacity-0",
          )}
        >
          <div className="border-b border-white-10 px-3 pb-3 pt-2">
            <p className="truncate text-sm text-paper">{viewer.name}</p>
            <p className="truncate text-xs text-white-40">{viewer.email}</p>
          </div>
          <Link href="/account" className="slate block px-3 py-3 text-white-70 hover:bg-white-6 hover:text-paper">
            Account &amp; billing
          </Link>
          <Link href="/create" className="slate block px-3 py-3 text-white-70 hover:bg-white-6 hover:text-paper">
            Studio
          </Link>
          {viewer.isAdmin && (
            <Link href="/admin" className="slate block px-3 py-3 text-rec hover:bg-white-6">
              Admin panel
            </Link>
          )}
          <SignOutButton className="slate w-full border-t border-white-10 px-3 py-3 text-left text-white-70 hover:bg-white-6 hover:text-paper" />
        </div>
      </div>
    </div>
  );
}
