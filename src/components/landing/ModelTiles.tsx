import Link from "next/link";
import { MODEL_TILES } from "@/data/landing";
import { Media } from "@/components/ui/Media";
import { Badge } from "@/components/ui/Badge";

export function ModelTiles() {
  return (
    <section className="mx-auto mt-10 max-w-[1400px] px-4 md:px-6">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {MODEL_TILES.map((tile) => (
          <Link
            key={tile.name}
            href={tile.href}
            className="group flex flex-col gap-3 rounded-2xl border border-white-8 bg-surface-primary p-3 transition-colors hover:border-white-16"
          >
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-surface-tertiary">
              <Media media={tile.media} alt={tile.name} sizes="(min-width: 1024px) 16vw, 45vw" />
              {tile.badge && (
                <Badge tone={tile.badge === "Top" ? "neutral" : "lime"} className="absolute left-2 top-2">
                  {tile.badge}
                </Badge>
              )}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-white-40">{tile.kicker}</p>
              <p className="mt-0.5 text-sm font-medium text-white-90">{tile.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
