import Link from "next/link";
import type { Tool } from "@/data/tools";
import { Media } from "@/components/ui/Media";

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={tool.href} className="group flex flex-col bg-ink p-3 transition-colors hover:bg-ink-raised">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink-raised">
        <Media
          media={tool.media}
          alt={tool.name}
          sizes="(min-width: 1024px) 24vw, 45vw"
          className="noir-media transition-transform duration-700 group-hover:scale-105"
        />
        {tool.badge && (
          <span
            className={
              tool.badge === "core"
                ? "slate absolute left-2 top-2 bg-ink/80 px-1.5 py-1 text-paper"
                : "slate absolute left-2 top-2 bg-rec px-1.5 py-1 text-ink"
            }
          >
            {tool.badge}
          </span>
        )}
      </div>
      <div className="flex items-start justify-between gap-3 px-1 pb-1 pt-4">
        <div>
          <p className="display text-2xl leading-tight">{tool.name}</p>
          <p className="mt-1 text-xs text-white-60">{tool.description}</p>
        </div>
        <span className="slate mt-1 text-rec opacity-0 transition-opacity group-hover:opacity-100">→</span>
      </div>
    </Link>
  );
}
