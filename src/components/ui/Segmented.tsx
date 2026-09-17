import { cn } from "@/lib/cn";

export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-white-40">{label}</label>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              value === opt ? "bg-lime text-black" : "bg-white-6 text-white-70 hover:bg-white-10",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
