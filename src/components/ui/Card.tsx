import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white-8 bg-surface-primary overflow-hidden",
        className,
      )}
    >
      {children}
    </div>
  );
}
