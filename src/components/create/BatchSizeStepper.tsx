import { Minus, Plus } from "lucide-react";

export function BatchSizeStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wide text-white-40">Batch size</label>
      <div className="mt-2 flex w-fit items-center gap-3 rounded-lg bg-white-6 px-2 py-1.5">
        <button
          type="button"
          aria-label="Decrease batch size"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="flex h-6 w-6 items-center justify-center rounded-md text-white-70 hover:bg-white-10 disabled:opacity-30"
        >
          <Minus size={14} />
        </button>
        <span className="w-4 text-center text-sm font-medium text-white-90">{value}</span>
        <button
          type="button"
          aria-label="Increase batch size"
          onClick={() => onChange(Math.min(4, value + 1))}
          disabled={value >= 4}
          className="flex h-6 w-6 items-center justify-center rounded-md text-white-70 hover:bg-white-10 disabled:opacity-30"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
