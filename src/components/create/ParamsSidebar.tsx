"use client";

import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { PromptBox } from "@/components/create/PromptBox";
import { ModelPicker } from "@/components/create/ModelPicker";
import { PresetPicker } from "@/components/create/PresetPicker";
import { BatchSizeStepper } from "@/components/create/BatchSizeStepper";
import { GenerateButton } from "@/components/create/GenerateButton";
import { Segmented } from "@/components/ui/Segmented";
import { CREATE_MODELS, ASPECT_RATIOS, QUALITIES } from "@/data/create-models";
import { useCredits, useGenerationStore } from "@/lib/generation/store";
import { creditCost, type GenerationParams, type GenerationType } from "@/lib/generation/types";

export function ParamsSidebar({
  initialType,
  initialModel,
  initialPreset,
  initialPrompt,
  initialCredits,
}: {
  initialType: GenerationType;
  initialModel?: string;
  initialPreset?: string;
  initialPrompt?: string;
  /** Server-rendered balance from the user's profile. */
  initialCredits: number;
}) {
  const submitJob = useGenerationStore((s) => s.submitJob);
  const setCredits = useGenerationStore((s) => s.setCredits);
  const credits = useCredits(initialCredits);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Seed the store with the server balance for this page view.
  useEffect(() => {
    setCredits(initialCredits);
  }, [initialCredits, setCredits]);

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

  async function handleGenerate() {
    if (!prompt.trim() || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    const result = await submitJob(params);
    setSubmitting(false);
    if (!result.ok) setSubmitError(result.error);
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Segmented label="Type" options={["image", "video"] as const} value={type} onChange={handleTypeChange} />
        <p className="mt-2 text-xs text-white-40">
          {type === "image"
            ? "Stills render for real via Pollinations.ai (free, open models)."
            : "Video is a preview simulation — it returns sample clips; credits are still charged."}
        </p>
      </div>

      <PromptBox value={prompt} onChange={setPrompt} />

      <div>
        <label className="slate text-white-40">Reference image</label>
        <label className="slate mt-2 flex h-16 cursor-pointer items-center justify-center gap-2 border border-dashed border-white-16 text-white-60 transition-colors hover:border-paper hover:text-paper">
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

      <GenerateButton
        cost={cost}
        credits={credits}
        disabled={!prompt.trim()}
        pending={submitting}
        error={submitError}
        onClick={handleGenerate}
      />
    </div>
  );
}
