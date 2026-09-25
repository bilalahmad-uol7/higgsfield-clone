import { cn } from "@/lib/cn";

// Seamless infinite marquee: the track holds two copies of the items and
// slides by exactly half its width, so the loop point is invisible.
export function Marquee({
  children,
  reverse = false,
  duration = 40,
  className,
}: {
  children: React.ReactNode;
  reverse?: boolean;
  duration?: number;
  className?: string;
}) {
  return (
    <div className={cn("group flex overflow-hidden mask-fade-x", className)}>
      <div
        className="flex w-max shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]"
        style={
          {
            "--marquee-duration": `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          } as React.CSSProperties
        }
      >
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
