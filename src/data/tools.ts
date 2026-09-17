import type { MediaRef } from "@/lib/media";

export type ToolCategory = "Images" | "Videos" | "Edit" | "Characters" | "Models";

export type Tool = {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  badge?: "core" | "New";
  href: string;
  media: MediaRef;
};

export const TOOLS: Tool[] = [
  {
    id: "soul",
    name: "Soul",
    category: "Images",
    description: "Flagship photoreal image model, fashion-grade output.",
    badge: "core",
    href: "/create?type=image&model=soul",
    media: { cdn: "card/9c6affe8-03a8-4434-97ef-2fc476f7a71e.webp", local: "tool-soul.webp" },
  },
  {
    id: "soul-id",
    name: "Soul ID",
    category: "Characters",
    description: "Train a consistent character identity from 20+ photos.",
    badge: "New",
    href: "/create?type=image&model=soul-id",
    media: { cdn: "card/97dd1c17-15fb-443f-b1fa-f4a155d3c764.webp", local: "tool-soul-id.webp" },
  },
  {
    id: "soul-inpaint",
    name: "Soul Inpaint",
    category: "Edit",
    description: "Brush-edit any region of a generated image.",
    href: "/create?type=image&mode=inpaint",
    media: { cdn: "card/a8d8030f-9cc9-47ad-a266-e0d3708d2126.webp", local: "tool-soul-inpaint.webp" },
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    category: "Images",
    description: "Fast, high-quality visuals from text or reference.",
    href: "/create?type=image&model=nano-banana-pro",
    media: { cdn: "card/5fba4d2a-1023-4bd1-9d7a-e2faaf8a21d1.webp", local: "tool-nano-banana.webp" },
  },
  {
    id: "cinema-studio",
    name: "Cinema Studio",
    category: "Videos",
    description: "Multi-shot filmmaking with camera and lighting control.",
    badge: "core",
    href: "/create?type=video&model=cinema-studio",
    media: { cdn: "card/8b8270cd-dc63-4a34-88e7-3277536987fb.mp4", local: "tool-cinema-studio.mp4" },
  },
  {
    id: "genjutsu",
    name: "Genjutsu",
    category: "Videos",
    description: "Transfer motion into new scenes from a reference clip.",
    badge: "New",
    href: "/create?type=video&model=genjutsu",
    media: { cdn: "card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4", local: "tool-genjutsu.mp4" },
  },
  {
    id: "effects",
    name: "Effects 2.0",
    category: "Videos",
    description: "Viral camera-motion presets, ready in one click.",
    badge: "New",
    href: "/create?type=video&preset=floating-fall",
    media: { cdn: "viral_hub/151664fa-7f7f-43d6-80fa-4683104a3c02.webp", local: "tool-effects.webp" },
  },
  {
    id: "draw-to-video",
    name: "Draw to Video",
    category: "Videos",
    description: "Sketch-guided video generation and editing.",
    href: "/create?type=video&mode=draw",
    media: { cdn: "viral_hub/05201733-c72f-43ed-8393-8b8cea28b8ce.webp", local: "tool-draw-to-video.webp" },
  },
  {
    id: "marketing-studio",
    name: "Marketing Studio",
    category: "Videos",
    description: "Turn a product URL or image into a ready-to-run ad.",
    href: "/create?type=video&model=marketing-studio",
    media: { cdn: "viral_hub/5354ce11-c68c-45a0-8a97-5aab94f52833.webp", local: "tool-marketing-studio.webp" },
  },
  {
    id: "lipsync-studio",
    name: "Lipsync Studio",
    category: "Characters",
    description: "Talking avatar and lip-sync from a script or voice.",
    href: "/create?type=video&model=lipsync-studio",
    media: { cdn: "viral_hub/99aa3365-5ae0-4616-9722-ce0dc087607d.webp", local: "tool-lipsync.webp" },
  },
  {
    id: "3d-jutsu",
    name: "3D Jutsu",
    category: "Videos",
    description: "3D-aware motion and object control for video.",
    badge: "New",
    href: "/create?type=video&model=3d-jutsu",
    media: { cdn: "viral_hub/4a2315f6-57e1-4378-82a5-598ddbbfbbcb.webp", local: "tool-3d-jutsu.webp" },
  },
  {
    id: "upscale",
    name: "Upscale",
    category: "Edit",
    description: "Clean up and upscale image or video output to 4K.",
    href: "/create?type=video&mode=upscale",
    media: { cdn: "viral_hub/95cd0d73-4f3c-40d1-ac0b-c8668a99440b.webp", local: "tool-upscale.webp" },
  },
  {
    id: "reframe",
    name: "Reframe",
    category: "Edit",
    description: "Re-crop and re-frame existing footage for any aspect ratio.",
    href: "/create?type=video&mode=reframe",
    media: { cdn: "viral_hub/a1560137-597c-455a-be9e-9622cccf76a3.webp", local: "tool-reframe.webp" },
  },
  {
    id: "ai-influencer",
    name: "AI Influencer Studio",
    category: "Characters",
    description: "Build and manage a persistent AI influencer persona.",
    href: "/create?type=image&model=ai-influencer",
    media: { cdn: "viral_hub/30142c8a-46ee-4930-aca3-6fa5321dd84a.webp", local: "tool-ai-influencer.webp" },
  },
  {
    id: "sora-2",
    name: "Sora 2",
    category: "Models",
    description: "OpenAI's video model, available inside Higgsfield.",
    href: "/create?type=video&model=sora-2",
    media: { cdn: "viral_hub/17cc1333-9822-442c-adaa-d208c59e3e01.webp", local: "tool-sora-2.webp" },
  },
  {
    id: "veo-3-1",
    name: "Veo 3.1",
    category: "Models",
    description: "Google's video model with native audio.",
    href: "/create?type=video&model=veo-3.1",
    media: { cdn: "viral_hub/5e67ff0a-60f7-4c0a-8ace-18c9bf3e5426.webp", local: "tool-veo.webp" },
  },
  {
    id: "kling-3",
    name: "Kling 3.0",
    category: "Models",
    description: "Multimodal video with audio and consistency controls.",
    href: "/create?type=video&model=kling-3.0",
    media: { cdn: "viral_hub/6ecca888-1780-46ae-a86d-a05b69b2fe34.webp", local: "tool-kling.webp" },
  },
  {
    id: "seedance-2-5",
    name: "Seedance 2.5",
    category: "Models",
    description: "The most advanced video model on the platform.",
    badge: "core",
    href: "/create?type=video&model=seedance-2.5",
    media: { cdn: "card/92c90c2a-ce2f-47bd-8cff-26c90eb9f351.mp4", local: "tool-seedance.mp4" },
  },
];

export const TOOL_CATEGORIES: ("All" | "New" | ToolCategory)[] = [
  "All",
  "New",
  "Images",
  "Videos",
  "Edit",
  "Characters",
  "Models",
];
