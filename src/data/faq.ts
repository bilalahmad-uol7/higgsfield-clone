export type FaqItem = { q: string; a: string };

export const FAQ: FaqItem[] = [
  {
    q: "How do credits work?",
    a: "Every generation costs credits based on type, quality and batch size — a 1.5k image is a few credits, a 4K video more. Credits are shared across every model, so one balance covers image, video and audio.",
  },
  {
    q: "Can I use what I make commercially?",
    a: "Yes. On any paid plan you own the output and can use it in client work, ads and published projects. Free-tier output is for personal use.",
  },
  {
    q: "Which models are included?",
    a: "Seedance, Nano Banana Pro, Genjutsu, GPT Image, Cinema Studio and 50+ more. New models land in every plan the day they ship — no add-ons.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "Generation pauses until your next cycle, or you can top up with a one-time credit pack or turn on Auto-Refill so work never stops mid-shoot.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from settings and your plan runs to the end of the billing period. Unused monthly credits don't roll over; credit packs last 90 days.",
  },
  {
    q: "Do you have team plans?",
    a: "Team gives you a shared workspace, pooled credits per seat, roles and centralized billing. Enterprise adds SSO, custom volume and a dedicated contact.",
  },
  {
    q: "Is there an API?",
    a: "Yes — one API for every model, plus an MCP server so Claude and ChatGPT can generate directly inside your workflow.",
  },
  {
    q: "How long does a video take?",
    a: "Most clips render in under two minutes. Pro and above get priority queueing and higher concurrency, so batches finish together.",
  },
];
