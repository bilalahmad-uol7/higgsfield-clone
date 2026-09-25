import type { MediaRef } from "@/lib/media";

export type GenerationType = "image" | "video";
export type AspectRatio = "9:16" | "3:4" | "2:3" | "1:1" | "4:3" | "16:9" | "21:9";
export type Quality = "1.5k" | "2k" | "4K";

export type GenerationParams = {
  type: GenerationType;
  model: string;
  preset?: string;
  prompt: string;
  aspectRatio: AspectRatio;
  quality: Quality;
  batchSize: number;
};

export type JobStage = "queued" | "preparing" | "generating" | "upscaling" | "complete";

export const JOB_STAGES: JobStage[] = ["queued", "preparing", "generating", "upscaling", "complete"];

export type JobResult = {
  media: MediaRef;
};

export type Job = {
  id: string;
  createdAt: number;
  params: GenerationParams;
  stage: JobStage;
  progress: number;
  queuePosition: number;
  status: "running" | "complete" | "cancelled";
  cost: number;
  results: JobResult[];
  revealedCount: number;
};

export function creditCost(params: Pick<GenerationParams, "type" | "quality" | "batchSize">) {
  const base = params.type === "video" ? 8 : 3;
  const qualityMultiplier = params.quality === "4K" ? 2 : params.quality === "2k" ? 1.4 : 1;
  return Math.round(base * qualityMultiplier * params.batchSize);
}
