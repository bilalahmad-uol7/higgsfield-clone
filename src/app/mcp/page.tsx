import { ComingSoon } from "@/components/ui/ComingSoon";

export default function McpPage() {
  return (
    <ComingSoon
      title="Higgsfield MCP"
      description="Build games, motion graphics, and interactive 3D experiences with Higgsfield MCP."
      media={{ cdn: "card/8b8270cd-dc63-4a34-88e7-3277536987fb.mp4", local: "mcp-hero.mp4" }}
      cta={{ label: "Try Create instead", href: "/create?type=video" }}
    />
  );
}
