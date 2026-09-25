import { cn } from "@/lib/cn";

type Tone = "rec" | "neutral";

export function Badge({
  children,
  tone = "rec",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const toneClass: Record<Tone, string> = {
    rec: "bg-rec text-ink",
    neutral: "bg-white-10 text-white-90",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xs px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.1em]",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
