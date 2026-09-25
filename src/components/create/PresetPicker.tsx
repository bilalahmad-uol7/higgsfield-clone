import { EFFECTS } from "@/data/landing";
import { Media } from "@/components/ui/Media";
import { cn } from "@/lib/cn";

export function PresetPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (slug: string | undefined) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="slate text-white-40">Preset</label>
        {value && (
          <button type="button" onClick={() => onChange(undefined)} className="slate text-white-40 hover:text-rec">
            Clear
          </button>
        )}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1">
        {EFFECTS.slice(0, 8).map((effect) => {
          const selected = value === effect.slug;
          return (
            <button
              key={effect.slug}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(effect.slug)}
              className={cn(
                "group relative aspect-[3/4] overflow-hidden outline outline-1 -outline-offset-1",
                selected ? "outline-rec" : "outline-white-10 hover:outline-white-40",
              )}
            >
              <Media
                media={effect.poster}
                alt={effect.name}
                sizes="80px"
                className={cn("noir-media", selected && "is-live")}
              />
              <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-ink to-transparent px-1.5 pb-1 pt-4 text-left font-mono text-[9px] uppercase tracking-wider text-paper">
                {effect.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
