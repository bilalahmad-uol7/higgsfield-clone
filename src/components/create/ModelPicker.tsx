import { CREATE_MODELS } from "@/data/create-models";
import type { GenerationType } from "@/lib/generation/types";
import { cn } from "@/lib/cn";

export function ModelPicker({
  type,
  value,
  onChange,
}: {
  type: GenerationType;
  value: string;
  onChange: (v: string) => void;
}) {
  const models = CREATE_MODELS.filter((m) => m.type === type);

  return (
    <div>
      <label className="slate text-white-40">Model</label>
      <div role="radiogroup" aria-label="Model" className="mt-2 flex flex-col gap-px border border-white-10 bg-white-10">
        {models.map((model, i) => (
          <button
            key={model.id}
            type="button"
            role="radio"
            aria-checked={value === model.id}
            onClick={() => onChange(model.id)}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
              value === model.id ? "bg-paper text-ink" : "bg-ink text-white-70 hover:bg-ink-raised hover:text-paper",
            )}
          >
            <span className={cn("slate", value === model.id ? "text-rec" : "text-white-40")}>
              {String(i + 1).padStart(2, "0")}
            </span>
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );
}
