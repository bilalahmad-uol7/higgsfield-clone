export type NavLeaf = {
  label: string;
  href: string;
  badge?: "New" | "Beta";
  description?: string;
};

export type NavGroup = {
  label: string;
  href?: string;
  items?: NavLeaf[];
};

// Higgsfield's real header carries ~22 links. A flat bar doesn't scale at
// this density, so related links are grouped under a handful of triggers —
// every real link from the live nav is represented somewhere below.
export const NAV: NavGroup[] = [
  {
    label: "Image",
    href: "/create?type=image",
    items: [
      { label: "AI Image", href: "/create?type=image", description: "Text and reference-driven image generation" },
      { label: "Soul", href: "/create?type=image&model=soul", description: "Photoreal flagship image model" },
      { label: "Soul ID", href: "/create?type=image&model=soul-id", badge: "New", description: "Train a consistent character" },
      { label: "Edit", href: "/create?type=image&mode=edit", description: "Inpaint and targeted edits" },
    ],
  },
  {
    label: "Video",
    href: "/create?type=video",
    items: [
      { label: "AI Video", href: "/create?type=video", description: "Multi-model video generation" },
      { label: "Cinema Studio", href: "/create?type=video&model=cinema-studio", description: "Camera, lighting, multi-shot control" },
      { label: "Genjutsu", href: "/create?type=video&model=genjutsu", badge: "New", description: "Motion transfer from a reference clip" },
      { label: "Effects", href: "/explore?tab=effects", badge: "New", description: "Viral camera-motion presets" },
      { label: "Marketing Studio", href: "/create?type=video&model=marketing-studio", description: "Ads from a product URL or image" },
      { label: "3D Jutsu", href: "/create?type=video&model=3d-jutsu", badge: "New", description: "3D-aware motion and object control" },
    ],
  },
  { label: "Audio", href: "/create?type=audio" },
  {
    label: "MCP",
    href: "/mcp",
    items: [
      { label: "MCP", href: "/mcp", description: "Turn Claude into a creative engine" },
      { label: "API", href: "/api", badge: "New", description: "50+ models behind one API" },
      { label: "ChatGPT Plugin", href: "/plugins/chatgpt", description: "Higgsfield inside ChatGPT" },
      { label: "Supercomputer", href: "/supercomputer", description: "Agent that plans an entire project" },
      { label: "Canvas", href: "/canvas", description: "Infinite node-based creative board" },
    ],
  },
  {
    label: "Community",
    href: "/explore",
    items: [
      { label: "Explore", href: "/explore", description: "Creation hub — every tool in one grid" },
      { label: "Community", href: "/explore?tab=community", description: "Public projects and Recreate" },
      { label: "Contests", href: "/community/contests", description: "Higgsfield Global Film Festival" },
      { label: "Originals", href: "/community/originals", description: "Studio-made showcase projects" },
      { label: "Academy", href: "/academy", description: "Guides and structured courses" },
    ],
  },
];

export const NAV_RIGHT: NavLeaf[] = [
  { label: "Pricing", href: "/pricing" },
  { label: "Enterprise", href: "/pricing?plan=enterprise" },
];
