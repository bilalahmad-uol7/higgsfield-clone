import { Zap } from "lucide-react";
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
          "flex h-12 w-full items-center justify-center gap-2 rounded-pill text-sm font-semibold transition-colors",
          "bg-lime text-black hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        Generate
        <span className="flex items-center gap-1 rounded-pill bg-black/10 px-2 py-0.5 text-xs">
          <Zap size={12} className="fill-current" />
          {cost}
        </span>
      </button>
      {insufficientCredits && (
        <p className="text-center text-xs text-error">Not enough credits — top up to continue.</p>
      )}
      <p className="text-center text-xs text-white-40">{credits} credits available</p>
    </div>
  );
}
