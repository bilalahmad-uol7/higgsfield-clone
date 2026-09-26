export type PricingPlan = {
  id: string;
  name: string;
  monthly: number;
  annual: number;
  credits: number;
  unit: "mo" | "seat";
  description: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
};

export const PLANS: PricingPlan[] = [
  {
    id: "basic",
    name: "Basic",
    monthly: 9,
    annual: 9,
    credits: 120,
    unit: "mo",
    description: "Try Higgsfield's core models at low volume.",
    features: ["120 credits / month", "Standard generation speed", "Watermark-free output"],
    cta: "Get Basic",
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 29,
    annual: 23,
    credits: 600,
    unit: "mo",
    description: "For creators publishing regularly.",
    features: ["600 credits / month", "Priority generation queue", "Soul ID character training", "Access to all presets"],
    highlighted: true,
    cta: "Get Pro",
  },
  {
    id: "max",
    name: "Max",
    monthly: 79,
    annual: 59,
    credits: 1800,
    unit: "mo",
    description: "High-volume generation for studios.",
    features: ["1,800 credits / month", "Concurrency boost", "4K upscale included", "Early access to new models"],
    cta: "Get Max",
  },
  {
    id: "team",
    name: "Team",
    monthly: 79,
    annual: 69,
    credits: 1000,
    unit: "seat",
    description: "Shared workspace and pooled credits.",
    features: ["1,000 pooled credits / seat", "Shared Assets library", "Team roles & permissions", "Centralized billing"],
    cta: "Get Team",
  },
];

export const ENTERPRISE = {
  name: "Enterprise",
  description: "Custom volume, SSO, dedicated support, and admin controls.",
  cta: "Contact sales",
};

export type CreditPack = { id: string; label: string; detail: string; price?: number; credits?: number };

// Packs with a price and credits are purchasable one-time top-ups; Auto-Refill
// is informational only.
export const CREDIT_PACKS: CreditPack[] = [
  { id: "autorefill", label: "Auto-Refill", detail: "$1 = 20 credits, applied automatically when you run out" },
  { id: "pack-600", label: "600 credits", price: 30, credits: 600, detail: "One-time top-up, expires in 90 days" },
  { id: "pack-1000", label: "1,000 credits", price: 50, credits: 1000, detail: "One-time top-up, expires in 90 days" },
];
