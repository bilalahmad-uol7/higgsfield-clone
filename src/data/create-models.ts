import type { GenerationType, AspectRatio, Quality } from "@/lib/generation/types";

export type CreateModel = { id: string; name: string; type: GenerationType };

export const CREATE_MODELS: CreateModel[] = [
  { id: "soul", name: "Soul", type: "image" },
  { id: "soul-id", name: "Soul ID", type: "image" },
  { id: "nano-banana-pro", name: "Nano Banana Pro", type: "image" },
  { id: "gpt-image-2.5", name: "GPT Image 2.5", type: "image" },
  { id: "seedream-5.0", name: "Seedream 5.0", type: "image" },
  { id: "flux-2", name: "FLUX 2", type: "image" },
  { id: "cinema-studio", name: "Cinema Studio", type: "video" },
  { id: "genjutsu", name: "Genjutsu", type: "video" },
  { id: "seedance-2.5", name: "Seedance 2.5", type: "video" },
  { id: "sora-2", name: "Sora 2", type: "video" },
  { id: "veo-3.1", name: "Veo 3.1", type: "video" },
  { id: "kling-3.0", name: "Kling 3.0", type: "video" },
  { id: "marketing-studio", name: "Marketing Studio", type: "video" },
  { id: "3d-jutsu", name: "3D Jutsu", type: "video" },
];

export const ASPECT_RATIOS: AspectRatio[] = ["9:16", "3:4", "2:3", "1:1", "4:3", "16:9", "21:9"];
export const QUALITIES: Quality[] = ["1.5k", "2k", "4K"];
