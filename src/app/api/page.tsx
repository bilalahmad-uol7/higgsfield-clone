import { ComingSoon } from "@/components/ui/ComingSoon";

export default function ApiPage() {
  return (
    <ComingSoon
      title="Higgsfield API"
      description="Best prices in GenAI across 50+ models in one API."
      media={{ cdn: "card/92c90c2a-ce2f-47bd-8cff-26c90eb9f351.mp4", local: "api-hero.mp4" }}
      cta={{ label: "Try Create instead", href: "/create?type=video" }}
    />
  );
}
