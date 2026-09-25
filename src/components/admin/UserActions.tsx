"use client";

import { useActionState } from "react";
import { adjustCredits, toggleAdmin, type ActionResult } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

export function UserActions({ userId, isAdmin, isSelf }: { userId: string; isAdmin: boolean; isSelf: boolean }) {
  const [credits, creditAction, creditPending] = useActionState<ActionResult, FormData>(adjustCredits, null);
  const [role, roleAction, rolePending] = useActionState<ActionResult, FormData>(toggleAdmin, null);
  const result = credits ?? role;

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <form action={creditAction} className="flex">
          <input type="hidden" name="userId" value={userId} />
          <input
            name="amount"
            type="number"
            step={1}
            required
            placeholder="±cr"
            aria-label="Credits to add or remove"
            className="w-20 border border-white-16 bg-ink px-2 py-1.5 text-right font-mono text-xs text-paper focus:border-rec focus:outline-none"
          />
          <button
            type="submit"
            disabled={creditPending}
            className="slate border border-l-0 border-white-16 px-2.5 py-1.5 text-white-70 hover:text-paper disabled:opacity-40"
          >
            Apply
          </button>
        </form>
        {!isSelf && (
          <form action={roleAction}>
            <input type="hidden" name="userId" value={userId} />
            <button
              type="submit"
              disabled={rolePending}
              className="slate border border-white-16 px-2.5 py-1.5 text-white-70 hover:border-paper hover:text-paper disabled:opacity-40"
            >
              {isAdmin ? "Revoke admin" : "Make admin"}
            </button>
          </form>
        )}
      </div>
      {result && (
        <p role="status" className={cn("slate", result.ok ? "text-white-60" : "text-rec")}>
          {result.message}
        </p>
      )}
    </div>
  );
}
