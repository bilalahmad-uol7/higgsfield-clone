import { Timecode } from "@/components/motion/Timecode";
import { cn } from "@/lib/cn";

const CORNER = "absolute h-5 w-5 border-paper/70";

// Camera viewfinder overlay: four corner brackets, and optionally a blinking
// REC indicator with a running timecode in the top-left.
export function Viewfinder({
  rec = false,
  label,
  inset = "inset-4",
  className,
}: {
  rec?: boolean;
  label?: string;
  inset?: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute", inset, className)}>
      <span className={cn(CORNER, "left-0 top-0 border-l border-t")} />
      <span className={cn(CORNER, "right-0 top-0 border-r border-t")} />
      <span className={cn(CORNER, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(CORNER, "bottom-0 right-0 border-b border-r")} />
      {rec && (
        <div className="slate absolute left-7 top-6 flex items-center gap-2 text-paper/90">
          <span className="h-2 w-2 animate-rec rounded-full bg-rec" />
          <span>Rec</span>
          <Timecode className="text-paper/60" />
        </div>
      )}
      {label && <div className="slate absolute right-7 top-6 hidden text-paper/60 sm:block">{label}</div>}
    </div>
  );
}
