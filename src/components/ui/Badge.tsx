import { cn } from "@/lib/cn";

type Tone = "lime" | "neutral" | "magenta";

export function Badge({
  children,
  tone = "lime",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  const toneClass: Record<Tone, string> = {
    lime: "bg-lime text-black",
    neutral: "bg-white-10 text-white-90",
    magenta: "bg-magenta text-white",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-pill px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        toneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
