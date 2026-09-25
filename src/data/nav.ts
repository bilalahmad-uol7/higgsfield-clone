export type NavLeaf = {
  label: string;
  href: string;
  badge?: string;
  description?: string;
};

export type NavItem = NavLeaf | { label: string; children: NavLeaf[] };

export function isGroup(item: NavItem): item is { label: string; children: NavLeaf[] } {
  return "children" in item;
}

// Redesigned IA: the old flat 13-link row is folded into a few intent-based
// groups (make something / use a studio / build on it). Every original route
// is still reachable.
export const NAV: NavItem[] = [
  { label: "Explore", href: "/explore" },
  {
    label: "Create",
    children: [
      { label: "Image", href: "/create?type=image", description: "Stills from any prompt" },
      { label: "Video", href: "/create?type=video", description: "Motion with camera control" },
      { label: "Audio", href: "/create?type=audio", description: "Voice, lipsync & sound" },
    ],
  },
  {
    label: "Studios",
    children: [
      { label: "Cinema Studio", href: "/create?type=video&model=cinema-studio", description: "Direct full scenes" },
      { label: "Marketing Studio", href: "/create?type=video&model=marketing-studio", description: "Ads at scale" },
      { label: "Genjutsu", href: "/create?type=video&model=genjutsu", badge: "New", description: "One video, many versions" },
      { label: "Effects", href: "/explore?tab=effects", badge: "Free", description: "Viral presets in one click" },
    ],
  },
  {
    label: "Build",
    children: [
      { label: "MCP", href: "/mcp", description: "Higgsfield inside Claude & ChatGPT" },
      { label: "API", href: "/api", badge: "New", description: "50+ models, one endpoint" },
      { label: "After Effects", href: "/plugins/after-effects", description: "AI motion designer plugin" },
      { label: "Supercomputer", href: "/supercomputer", description: "One agent for your stack" },
    ],
  },
  { label: "Pricing", href: "/pricing", badge: "30% off" },
  { label: "Enterprise", href: "/pricing?plan=enterprise" },
];
