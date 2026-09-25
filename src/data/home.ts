import type { MediaRef } from "@/lib/media";

// Copy and media for the redesigned landing page. Studio names are invented
// on purpose — the marquee shouldn't imply endorsements that don't exist.

// Clean, text-free footage only. The `card/*` promo clips carry baked-in UI
// and captions that fight the typography, so the redesign avoids them.
const CLIP = {
  kaiju: { staticCdn: "promotions/seedance_2_5_explore_image.mp4", local: "clip-kaiju.mp4" },
  skate: {
    cdn: "user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094513_629920b7-4009-46de-b3b6-b80cc2185275_min.mp4",
    local: "clip-skate.mp4",
  },
  rave: {
    cdn: "user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094445_b0de712b-ae62-4fb9-9b07-2757b2d0338b_min.mp4",
    local: "clip-rave.mp4",
  },
  street: { cdn: "viral_hub/d877f71c-d2f3-44df-9317-f3ce6889bcb6.mp4", local: "clip-street.mp4" },
  portrait: { cdn: "viral_hub/c129fb83-2014-4a37-a3f8-6c7dfeab0254.mp4", local: "clip-portrait.mp4" },
  closeup: { cdn: "viral_hub/dba03734-6e8a-4337-acb4-17ce943563d8.mp4", local: "clip-closeup.mp4" },
} satisfies Record<string, MediaRef>;

export const HERO = {
  kicker: "AI film studio · 50+ models",
  line1: "Direct anything.",
  line2: "Camera optional.",
  sub: "Write a scene, pick the camera move, and roll. Higgsfield turns one prompt into cinema-grade video, images and sound.",
  media: CLIP.kaiju,
  cta: { label: "Start directing", href: "/create?type=video" },
  secondary: { label: "Watch the reel", href: "#reel" },
};

export type StudioMark = { name: string; style: "serif" | "serif-italic" | "mono" | "sans" | "condensed" };

export const STUDIOS: StudioMark[] = [
  { name: "Northlight Pictures", style: "serif" },
  { name: "KINO/LAB", style: "mono" },
  { name: "Atlas & Reed", style: "serif-italic" },
  { name: "HALFTONE", style: "condensed" },
  { name: "Paper Moon Films", style: "serif" },
  { name: "studio.okto", style: "sans" },
  { name: "Grain & Gauge", style: "serif-italic" },
  { name: "VANTA", style: "condensed" },
  { name: "Lowlight Co.", style: "sans" },
  { name: "FRAME/24", style: "mono" },
  { name: "Mirabel House", style: "serif" },
  { name: "Echo Park Motion", style: "serif-italic" },
];

export const HOW_IT_WORKS = {
  prompt:
    "A skater carves through a brutalist concrete plaza at golden hour, low tracking shot, sun flaring through the lens",
  moves: ["Low tracking", "Push in", "Lens flare"],
  media: CLIP.skate,
  steps: [
    { title: "Write", text: "Describe the scene like you would to a DP. Characters, light, mood — plain words." },
    { title: "Direct", text: "Pick camera moves, lens and pacing from a library of presets. No keyframes, no rigs." },
    { title: "Render", text: "Hit roll. Models fire in parallel, upscale to 4K, and land in your library." },
  ],
};

export const STAGE_NAME = {
  queued: "Queued",
  preparing: "Preparing scene",
  generating: "Generating frames",
  upscaling: "Upscaling to 4K",
  complete: "Complete",
} as const;

export const FINAL_CTA = {
  word: "Action.",
  title: "Your first shot is on us.",
  sub: "Free credits on sign up. No card, no crew, no call sheet.",
  media: CLIP.rave,
};

export type ReelFrame = { title: string; meta: string; media: MediaRef; prompt: string };

export const REEL: ReelFrame[] = [
  { title: "Valley of Giants", meta: "21:9 · 00:30", media: CLIP.kaiju, prompt: "Giant mechs battle across a jungle valley, epic wide shot, laser fire and smoke" },
  { title: "Concrete Gold", meta: "16:9 · 00:15", media: CLIP.skate, prompt: "A skater carves through a brutalist plaza at golden hour, low tracking shot" },
  { title: "Static Bloom", meta: "16:9 · 00:14", media: CLIP.rave, prompt: "A singer at a night festival erupts in blue lightning, crowd in smoke" },
  { title: "Crosswalk", meta: "9:16 · 00:12", media: CLIP.street, prompt: "Candid street style, a woman in stripes crosses a sunlit avenue" },
  { title: "Turtleneck", meta: "4:3 · 00:08", media: CLIP.portrait, prompt: "Editorial portrait, black turtleneck, warm tungsten light, slow push" },
  { title: "Iris", meta: "9:16 · 00:07", media: CLIP.closeup, prompt: "Extreme macro of an eye, iris textures, cinematic shallow depth" },
];

export type Feature = {
  name: string;
  kicker: string;
  description: string;
  href: string;
  media: MediaRef;
  badge?: string;
};

const poster = (id: string, local: string): MediaRef => ({ cdn: `viral_hub/${id}.webp`, local });

// Bento tiles get their own text-free media (clips + effect stills) instead
// of the promo cards, which carry baked-in captions.
export const FEATURES: Feature[] = [
  {
    name: "Cinema Studio",
    kicker: "Direct",
    description: "Block full scenes with real camera language — dolly, crane, orbit, rack focus.",
    href: "/create?type=video&model=cinema-studio",
    media: CLIP.portrait,
  },
  {
    name: "Seedance 2.5",
    kicker: "Video",
    description: "The most advanced video model",
    href: "/create?type=video&model=seedance-2.5",
    media: poster("5354ce11-c68c-45a0-8a97-5aab94f52833", "feature-seedance.webp"),
    badge: "Top",
  },
  {
    name: "Nano Banana Pro",
    kicker: "Image",
    description: "Stills with studio lighting",
    href: "/create?type=image&model=nano-banana-pro",
    media: poster("99aa3365-5ae0-4616-9722-ce0dc087607d", "feature-nano-banana.webp"),
  },
  {
    name: "Genjutsu",
    kicker: "Remix",
    description: "One video, many versions",
    href: "/create?type=video&model=genjutsu",
    media: CLIP.closeup,
    badge: "New",
  },
  {
    name: "Effects",
    kicker: "Presets",
    description: "Viral moves in one click",
    href: "/explore?tab=effects",
    media: poster("05201733-c72f-43ed-8393-8b8cea28b8ce", "feature-effects.webp"),
    badge: "Free",
  },
  {
    name: "MCP & API",
    kicker: "Build",
    description: "Generate from Claude, ChatGPT or code",
    href: "/mcp",
    media: poster("95cd0d73-4f3c-40d1-ac0b-c8668a99440b", "feature-mcp.webp"),
  },
];
