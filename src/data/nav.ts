export type NavLeaf = {
  label: string;
  href: string;
  badge?: string;
  dividerBefore?: boolean;
};

// Flat single-row nav, matching the real higgsfield.ai header exactly (no
// mega-menu/dropdowns — every item is a direct link, badges inline).
export const NAV_LEFT: NavLeaf[] = [
  { label: "Explore", href: "/explore" },
  { label: "Image", href: "/create?type=image" },
  { label: "Video", href: "/create?type=video" },
  { label: "Audio", href: "/create?type=audio" },
  { label: "MCP", href: "/mcp" },
  { label: "API", href: "/api", badge: "New" },
  { label: "ChatGPT Plugin", href: "/mcp", badge: "New", dividerBefore: true },
  { label: "Genjutsu", href: "/create?type=video&model=genjutsu", badge: "New" },
  { label: "Effects", href: "/explore?tab=effects", badge: "Free" },
  { label: "Cinema Studio", href: "/create?type=video&model=cinema-studio" },
  { label: "Marketing Studio", href: "/create?type=video&model=marketing-studio" },
];

export const NAV_RIGHT: NavLeaf[] = [
  { label: "Pricing", href: "/pricing", badge: "30% OFF" },
  { label: "Enterprise", href: "/pricing?plan=enterprise" },
];
