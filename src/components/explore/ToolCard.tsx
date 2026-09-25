import Link from "next/link";
import type { Tool } from "@/data/tools";
import { Media } from "@/components/ui/Media";
import { Badge } from "@/components/ui/Badge";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={tool.href}
      className="group flex flex-col gap-3 rounded-2xl border border-white-8 bg-surface-primary p-3 transition-colors hover:border-white-16"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-surface-tertiary">
        <Media media={tool.media} alt={tool.name} sizes="(min-width: 1024px) 24vw, 45vw" />
        {tool.badge && (
          <Badge tone={tool.badge === "core" ? "neutral" : "rec"} className="absolute left-2 top-2">
            {tool.badge}
          </Badge>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-white-90">{tool.name}</p>
        <p className="mt-0.5 text-xs text-white-60">{tool.description}</p>
      </div>
    </Link>
  );
}
