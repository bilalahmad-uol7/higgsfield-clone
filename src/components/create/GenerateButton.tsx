import { cn } from "@/lib/cn";

export function GenerateButton({
  cost,
  credits,
  disabled,
  onClick,
}: {
  cost: number;
  credits: number;
  disabled?: boolean;
  onClick: () => void;
}) {
  const insufficientCredits = credits < cost;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || insufficientCredits}
        className={cn(
          "group flex h-14 w-full items-center justify-between px-5 font-mono text-sm font-medium uppercase tracking-[0.16em] transition-colors",
          "bg-rec text-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        <span className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-ink group-enabled:group-hover:animate-rec" />
          Roll camera
        </span>
        <span className="text-xs tracking-[0.1em]">{cost} cr</span>
      </button>
      {insufficientCredits && (
        <p className="slate text-center text-error">Not enough credits — top up to continue.</p>
      )}
      <p className="slate text-center text-white-40">{credits} credits in the bank</p>
    </div>
  );
}
