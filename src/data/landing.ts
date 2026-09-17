import type { MediaRef } from "@/lib/media";

// Media references below point at real, publicly-hittable higgsfield.ai CDN
// assets (verified live — hotlinking works, no referer/CORS restriction).
// Local fallback filenames are used when NEXT_PUBLIC_MEDIA_SOURCE=local.

export type HeroSlide = {
  title: string;
  tagline: string;
  cta: string;
  href: string;
  media: MediaRef;
};

export const HERO_SLIDES: HeroSlide[] = [
  {
    title: "Higgsfield API",
    tagline: "Best prices in GenAI across 50+ models in one API",
    cta: "Open Higgsfield API",
    href: "/api",
    media: { cdn: "card/92c90c2a-ce2f-47bd-8cff-26c90eb9f351.mp4", local: "hero-api.mp4" },
  },
  {
    title: "Higgsfield Genjutsu",
    tagline: "One upload in. Endless new visions out.",
    cta: "Open Higgsfield Genjutsu",
    href: "/create?type=video&model=genjutsu",
    media: { cdn: "card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4", local: "hero-genjutsu.mp4" },
  },
  {
    title: "Higgsfield AI Motion Designer",
    tagline: "ChatGPT can now do motion design in After Effects.",
    cta: "Open Higgsfield AI Motion Designer",
    href: "/plugins/after-effects",
    media: { cdn: "card/8b8270cd-dc63-4a34-88e7-3277536987fb.mp4", local: "hero-motion-designer.mp4" },
  },
  {
    title: "Higgsfield Effects",
    tagline: "Viral video presets now in ChatGPT, with free generations",
    cta: "Open Higgsfield Effects",
    href: "/explore?tab=effects",
    media: { cdn: "card/31293efb-7438-41c9-84cc-8bc820ce39b6.mp4", local: "hero-effects.mp4" },
  },
  {
    title: "GPT Image 2.5 Sunburst",
    tagline: "Sharper edits with more natural light and texture",
    cta: "Open GPT Image 2.5 Sunburst",
    href: "/create?type=image&model=gpt-image-2.5",
    media: { cdn: "card/4da5ce4e-8483-4471-9564-0907b394d3e0.mp4", local: "hero-sunburst.mp4" },
  },
];

export type ModelTile = {
  name: string;
  badge?: "Top" | "New";
  kicker: string;
  description: string;
  href: string;
  media: MediaRef;
};

export const MODEL_TILES: ModelTile[] = [
  {
    name: "Seedance 2.5",
    badge: "Top",
    kicker: "Video",
    description: "The most advanced video model",
    href: "/create?type=video&model=seedance-2.5",
    media: { cdn: "card/97dd1c17-15fb-443f-b1fa-f4a155d3c764.webp", local: "tile-seedance.webp" },
  },
  {
    name: "Nano Banana Pro",
    kicker: "Image",
    description: "Generate high-quality visuals",
    href: "/create?type=image&model=nano-banana-pro",
    media: { cdn: "card/9c6affe8-03a8-4434-97ef-2fc476f7a71e.webp", local: "tile-nano-banana.webp" },
  },
  {
    name: "Higgsfield Genjutsu",
    badge: "New",
    kicker: "New",
    description: "One video, many versions",
    href: "/create?type=video&model=genjutsu",
    media: { cdn: "card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4", local: "tile-genjutsu.mp4" },
  },
  {
    name: "MCP & CLI",
    kicker: "MCP & CLI",
    description: "Turn Claude into a creative engine",
    href: "/mcp",
    media: { cdn: "card/a8d8030f-9cc9-47ad-a266-e0d3708d2126.webp", local: "tile-mcp.webp" },
  },
  {
    name: "Cinema Studio 4.0",
    kicker: "Cinema Studio 4.0",
    description: "Create cinematic scenes effortlessly",
    href: "/create?type=video&model=cinema-studio",
    media: { cdn: "card/8b8270cd-dc63-4a34-88e7-3277536987fb.mp4", local: "tile-cinema-studio.mp4" },
  },
  {
    name: "Supercomputer",
    kicker: "Supercomputer",
    description: "Agent powered by GPT-6 Astra",
    href: "/supercomputer",
    media: { cdn: "card/5fba4d2a-1023-4bd1-9d7a-e2faaf8a21d1.webp", local: "tile-supercomputer.webp" },
  },
];

export type EffectPreset = {
  slug: string;
  name: string;
  poster: MediaRef;
  preview: MediaRef;
};

const EFFECT_PREVIEW_POOL: MediaRef[] = [
  { cdn: "viral_hub/d877f71c-d2f3-44df-9317-f3ce6889bcb6.mp4", local: "effect-preview-1.mp4" },
  { cdn: "viral_hub/c129fb83-2014-4a37-a3f8-6c7dfeab0254.mp4", local: "effect-preview-2.mp4" },
  { cdn: "viral_hub/dba03734-6e8a-4337-acb4-17ce943563d8.mp4", local: "effect-preview-3.mp4" },
];

const EFFECT_DEFS: { slug: string; name: string; poster: string }[] = [
  { slug: "floating-fall", name: "Floating fall", poster: "151664fa-7f7f-43d6-80fa-4683104a3c02" },
  { slug: "high-flip", name: "High flip", poster: "05201733-c72f-43ed-8393-8b8cea28b8ce" },
  { slug: "burning-man", name: "Burning man", poster: "5354ce11-c68c-45a0-8a97-5aab94f52833" },
  { slug: "studio-slide", name: "Studio slide", poster: "99aa3365-5ae0-4616-9722-ce0dc087607d" },
  { slug: "incline", name: "Incline", poster: "4a2315f6-57e1-4378-82a5-598ddbbfbbcb" },
  { slug: "act-natural", name: "Act natural", poster: "95cd0d73-4f3c-40d1-ac0b-c8668a99440b" },
  { slug: "eyes-in", name: "Eyes in", poster: "a1560137-597c-455a-be9e-9622cccf76a3" },
  { slug: "street-colossus", name: "Street colossus", poster: "30142c8a-46ee-4930-aca3-6fa5321dd84a" },
  { slug: "melting", name: "Melting", poster: "17cc1333-9822-442c-adaa-d208c59e3e01" },
  { slug: "wild-ride", name: "Wild ride", poster: "5e67ff0a-60f7-4c0a-8ace-18c9bf3e5426" },
  { slug: "cutout", name: "Cutout", poster: "6ecca888-1780-46ae-a86d-a05b69b2fe34" },
  { slug: "world-morphing", name: "World morphing", poster: "b5c90864-c3c5-4b14-87a0-3739250fd00b" },
  { slug: "smash-and-grab", name: "Smash and grab", poster: "0abb112e-068d-45e4-acea-9c8c44a16781" },
  { slug: "selfception", name: "Selfception", poster: "495d9e85-0417-47d9-9e0a-722ace805852" },
  { slug: "lacewalker", name: "Lacewalker", poster: "ef3dfc4c-a4c2-44a0-af27-d005bd1c319d" },
];

export const EFFECTS: EffectPreset[] = EFFECT_DEFS.map((e, i) => ({
  slug: e.slug,
  name: e.name,
  poster: { cdn: `viral_hub/${e.poster}.webp`, local: `effect-${e.slug}.webp` },
  preview: EFFECT_PREVIEW_POOL[i % EFFECT_PREVIEW_POOL.length],
}));

export type Project = {
  title: string;
  author: string;
  visibility: "Public";
  slug: string;
  thumbnail: MediaRef;
  preview: MediaRef;
};

const PROJECT_PREVIEW_POOL: MediaRef[] = [
  { cdn: "card/92c90c2a-ce2f-47bd-8cff-26c90eb9f351.mp4", local: "project-preview-1.mp4" },
  { cdn: "card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4", local: "project-preview-2.mp4" },
  { cdn: "card/8b8270cd-dc63-4a34-88e7-3277536987fb.mp4", local: "project-preview-3.mp4" },
  { cdn: "card/31293efb-7438-41c9-84cc-8bc820ce39b6.mp4", local: "project-preview-4.mp4" },
  { cdn: "card/4da5ce4e-8483-4471-9564-0907b394d3e0.mp4", local: "project-preview-5.mp4" },
  { cdn: "viral_hub/d877f71c-d2f3-44df-9317-f3ce6889bcb6.mp4", local: "project-preview-6.mp4" },
  { cdn: "viral_hub/c129fb83-2014-4a37-a3f8-6c7dfeab0254.mp4", local: "project-preview-7.mp4" },
  { cdn: "viral_hub/dba03734-6e8a-4337-acb4-17ce943563d8.mp4", local: "project-preview-8.mp4" },
];

const PROJECT_DEFS: { title: string; folder: string; file: string }[] = [
  {
    title: "If you stop loving me, I'll die — I don't like dying, but for our love I'm ready to go that far",
    folder: "user_3Bu8kApHUBmQcoBNUYoyCcOGJne",
    file: "hf_20260414_170749_3474b08b-9dc4-49e6-b6e2-4af862eff61d_thumbnail.webp",
  },
  {
    title: "Cully Hill Boys",
    folder: "user_3CIjqzTsrKEUr8OzFBaYO4ux3nG",
    file: "hf_20260413_121933_7dfa9582-a536-4a83-9041-ee5aa102ff8c_thumbnail.webp",
  },
  {
    title: "Red Flag",
    folder: "user_3BuPFKmNsBjkEgZ5LeOvNlL8ShO",
    file: "hf_20260415_014636_4873f538-b114-48c3-b604-05e32945d184_thumbnail.webp",
  },
  {
    title: "Kok Boru",
    folder: "user_39acLUpaKDzX3Ox7Ekzzl7vlQ67",
    file: "hf_20260413_132040_3db6758b-7eef-4046-87e1-ec81097c126e_thumbnail.webp",
  },
  {
    title: "Adiliada",
    folder: "user_3CIezRC2bfkh5fn1Cl8MjaHdSlp",
    file: "hf_20260415_012608_2c21b2ad-368a-4199-bde3-e2c648d78186_thumbnail.webp",
  },
  {
    title: "ONEIRIC",
    folder: "user_3Cfdr00kbZ1hJCLpPQkaicInqxv",
    file: "hf_20260421_221116_5e4782a0-5148-4832-9362-d17ba238b58b_thumbnail.webp",
  },
  {
    title: "ZEPHYR: Special",
    folder: "user_3BtuMjeO56IlCCzTiD419c4NiyM",
    file: "hf_20260415_011357_9dd4f822-d35c-4a43-9102-61ad0bb14331_thumbnail.webp",
  },
  {
    title: "HELL GRIND",
    folder: "user_34hPp7fXOu4gkTrKKk2ESqFSfG1",
    file: "hf_20260413_124545_9ae0acdc-4d0e-4c03-a065-b572bf9c66cf_thumbnail.webp",
  },
];

export const PROJECTS: Project[] = PROJECT_DEFS.map((p, i) => ({
  title: p.title,
  author: "Higgsfield Studio",
  visibility: "Public",
  slug: p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  thumbnail: { cdn: `${p.folder}/${p.file}`, local: `project-${p.folder}.webp` },
  preview: PROJECT_PREVIEW_POOL[i % PROJECT_PREVIEW_POOL.length],
}));

export const PROMO_BAR = {
  eyebrow: "Sign up and get your extra discount",
  items: [
    { title: "Get unlimited Nano Banana Pro", cta: "Unlock your extra discount" },
    { title: "Access to Seedance 2.5", cta: "Get your discount" },
  ],
  cta: "Sign up and get your discount",
  media: { staticCdn: "promotions/seedance_2_5_explore_image.mp4", local: "promo-seedance.mp4" } satisfies MediaRef,
  poster: { staticCdn: "promotions/seedance-2-5-sale-hero-poster.jpg", local: "promo-poster.jpg" } satisfies MediaRef,
};

export const MCP_SECTION = {
  title: "Higgsfield MCP with GPT-6 Astra",
  description: "Build games, motion graphics, and interactive 3D experiences with Higgsfield MCP",
  ctaPrimary: "Install Higgsfield plugin",
  ctaSecondary: "Explore use cases",
};

export const GENJUTSU_SECTION = {
  eyebrow: "New model",
  title: "Higgsfield Genjutsu",
  description:
    "Take the motion and recast it with your characters, locations, and products, or swap specific elements while keeping the rest untouched.",
  cta: "View all presets",
  media: { cdn: "card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4", local: "genjutsu-hero.mp4" } satisfies MediaRef,
};

export const SEEDANCE_SECTION = {
  title: "Seedance 2.5",
  description: "The most advanced AI video model",
  cta: "View all of Seedance 2.5",
  media: { cdn: "card/92c90c2a-ce2f-47bd-8cff-26c90eb9f351.mp4", local: "seedance-hero.mp4" } satisfies MediaRef,
};

export const SUPERCOMPUTER_SECTION = {
  title: "Supercomputer",
  description: "One superagent for your entire creative stack",
  cta: "Try Supercomputer",
  bg: { staticCdn: "spc-banner/bg-spc-banner.png", local: "spc-banner-bg.png" } satisfies MediaRef,
  logo: { staticCdn: "spc-banner/spc-banner-logo.png", local: "spc-banner-logo.png" } satisfies MediaRef,
};
