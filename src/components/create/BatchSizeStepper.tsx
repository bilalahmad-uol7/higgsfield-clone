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
      <label className="slate text-white-40">Takes per roll</label>
      <div className="mt-2 flex w-fit items-center border border-white-10">
        <button
          type="button"
          aria-label="Decrease batch size"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="flex h-10 w-10 items-center justify-center text-white-70 hover:bg-white-6 hover:text-paper disabled:opacity-30"
        >
          <Minus size={14} />
        </button>
        <span className="display w-12 border-x border-white-10 text-center text-2xl leading-10 text-paper">{value}</span>
        <button
          type="button"
          aria-label="Increase batch size"
          onClick={() => onChange(Math.min(4, value + 1))}
          disabled={value >= 4}
          className="flex h-10 w-10 items-center justify-center text-white-70 hover:bg-white-6 hover:text-paper disabled:opacity-30"
        >
          <Plus size={14} />
        </button>
      </div>
    </div>
  );
}
