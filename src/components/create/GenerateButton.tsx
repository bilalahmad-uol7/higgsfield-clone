import Link from "next/link";
import { cn } from "@/lib/cn";

export function GenerateButton({
  cost,
  credits,
  disabled,
  pending,
  error,
  onClick,
}: {
  cost: number;
  credits: number;
  disabled?: boolean;
  pending?: boolean;
  error?: string | null;
  onClick: () => void;
}) {
  const insufficientCredits = credits < cost;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || pending || insufficientCredits}
        aria-busy={pending}
        className={cn(
          "group flex h-14 w-full items-center justify-between px-5 font-mono text-sm font-medium uppercase tracking-[0.16em] transition-colors",
          "bg-rec text-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <span className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink group-enabled:group-hover:animate-rec" />
          {pending ? "Rolling…" : "Roll camera"}
        </span>
        <span className="text-xs tracking-[0.1em]">{cost} cr</span>
      </button>
      {insufficientCredits ? (
        <p className="slate text-center text-error">
          Not enough credits —{" "}
          <Link href="/pricing" className="underline underline-offset-4">
            top up
          </Link>
        </p>
      ) : (
        error && (
          <p role="alert" className="slate text-center text-error">
            {error}
          </p>
        )
      )}
      <p className="slate text-center text-white-40">{credits} credits in the bank</p>
    </div>
  );
}
