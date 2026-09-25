import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

// Every section opens like a clapperboard: scene number + label, then a big
// serif title and an optional aside on the right.
export function SectionHead({
  scene,
  label,
  title,
  aside,
  className,
}: {
  scene: number;
  label: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6 md:flex-row md:items-end md:justify-between", className)}>
      <div>
        <Reveal>
          <p className="slate flex items-center gap-3 text-white-60">
            <span className="text-rec">SC.{String(scene).padStart(2, "0")}</span>
            <span className="h-px w-8 bg-white-24" />
            {label}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h2 className="display mt-5 text-5xl sm:text-6xl lg:text-7xl">{title}</h2>
        </Reveal>
      </div>
      {aside && (
        <Reveal delay={0.16} className="max-w-sm text-sm text-white-60 md:text-right">
          {aside}
        </Reveal>
      )}
    </div>
  );
}
