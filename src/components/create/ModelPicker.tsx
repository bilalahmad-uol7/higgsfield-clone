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
      <label className="text-xs font-medium uppercase tracking-wide text-white-40">Model</label>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => onChange(model.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              value === model.id ? "bg-lime text-black" : "bg-white-6 text-white-70 hover:bg-white-10",
            )}
          >
            {model.name}
          </button>
        ))}
      </div>
    </div>
  );
}
