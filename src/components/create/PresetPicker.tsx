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
        <label className="text-xs font-medium uppercase tracking-wide text-white-40">Preset</label>
        {value && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="text-xs text-white-40 hover:text-white-70"
          >
            Change
          </button>
        )}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5">
        {EFFECTS.slice(0, 8).map((effect) => (
          <button
            key={effect.slug}
            type="button"
            onClick={() => onChange(effect.slug)}
            className={cn(
              "group relative aspect-square overflow-hidden rounded-lg border",
              value === effect.slug ? "border-rec" : "border-white-8 hover:border-white-16",
            )}
          >
            <Media media={effect.poster} alt={effect.name} sizes="80px" />
            <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1 py-0.5 text-[10px] text-white">
              {effect.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
