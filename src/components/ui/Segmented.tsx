import { cn } from "@/lib/cn";

// Square "camera settings" toggle bank: options share hairline dividers and
// the selected one inverts to paper-on-ink.
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  format,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
  format?: (v: T) => string;
}) {
  return (
    <div>
      <label className="slate text-white-40">{label}</label>
      <div role="radiogroup" aria-label={label} className="mt-2 flex flex-wrap gap-px border border-white-10 bg-white-10">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={value === opt}
            onClick={() => onChange(opt)}
            className={cn(
              "slate flex-1 whitespace-nowrap px-3 py-2.5 transition-colors",
              value === opt ? "bg-paper text-ink" : "bg-ink text-white-60 hover:bg-ink-raised hover:text-paper",
            )}
          >
            {format ? format(opt) : opt}
          </button>
        ))}
      </div>
    </div>
  );
}
