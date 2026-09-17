"use client";

import { useState } from "react";
import { ImagePlus } from "lucide-react";
import { PromptBox } from "@/components/create/PromptBox";
import { ModelPicker } from "@/components/create/ModelPicker";
import { PresetPicker } from "@/components/create/PresetPicker";
import { BatchSizeStepper } from "@/components/create/BatchSizeStepper";
import { GenerateButton } from "@/components/create/GenerateButton";
import { Segmented } from "@/components/ui/Segmented";
import { CREATE_MODELS, ASPECT_RATIOS, QUALITIES } from "@/data/create-models";
import { useGenerationStore } from "@/lib/generation/store";
import { creditCost, type GenerationParams, type GenerationType } from "@/lib/generation/types";

export function ParamsSidebar({
  initialType,
  initialModel,
  initialPreset,
  initialPrompt,
}: {
  initialType: GenerationType;
  initialModel?: string;
  initialPreset?: string;
  initialPrompt?: string;
}) {
  const submitJob = useGenerationStore((s) => s.submitJob);
  const credits = useGenerationStore((s) => s.credits);

  const [type, setType] = useState<GenerationType>(initialType);
  const [model, setModel] = useState(
    initialModel ?? CREATE_MODELS.find((m) => m.type === initialType)!.id,
  );
  const [preset, setPreset] = useState<string | undefined>(initialPreset);
  const [prompt, setPrompt] = useState(initialPrompt ?? "");
  const [aspectRatio, setAspectRatio] = useState(ASPECT_RATIOS[0]);
  const [quality, setQuality] = useState(QUALITIES[0]);
  const [batchSize, setBatchSize] = useState(1);
  const [referenceFileName, setReferenceFileName] = useState<string | null>(null);

  function handleTypeChange(next: GenerationType) {
    setType(next);
    setModel(CREATE_MODELS.find((m) => m.type === next)!.id);
    setPreset(undefined);
  }

  const params: GenerationParams = { type, model, preset, prompt, aspectRatio, quality, batchSize };
  const cost = creditCost(params);

  function handleGenerate() {
    if (!prompt.trim()) return;
    submitJob(params);
  }

  return (
    <div className="flex flex-col gap-5">
      <Segmented label="Type" options={["image", "video"] as const} value={type} onChange={handleTypeChange} />

      <PromptBox value={prompt} onChange={setPrompt} />

      <div>
        <label className="text-xs font-medium uppercase tracking-wide text-white-40">Reference image</label>
        <label className="mt-2 flex h-20 cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white-16 text-xs text-white-60 hover:border-white-24">
          <ImagePlus size={16} />
          {referenceFileName ?? "Add image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => setReferenceFileName(e.target.files?.[0]?.name ?? null)}
          />
        </label>
      </div>

      <ModelPicker type={type} value={model} onChange={setModel} />

      {type === "video" && <PresetPicker value={preset} onChange={setPreset} />}

      <Segmented label="Aspect ratio" options={ASPECT_RATIOS} value={aspectRatio} onChange={setAspectRatio} />
      <Segmented label="Quality" options={QUALITIES} value={quality} onChange={setQuality} />
      <BatchSizeStepper value={batchSize} onChange={setBatchSize} />

      <GenerateButton cost={cost} credits={credits} disabled={!prompt.trim()} onClick={handleGenerate} />
    </div>
  );
}
