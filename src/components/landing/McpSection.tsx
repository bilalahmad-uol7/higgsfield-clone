import { MCP_SECTION } from "@/data/landing";
import { Button } from "@/components/ui/Button";

export function McpSection() {
  return (
    <section className="mx-auto mt-14 max-w-[1400px] px-4 text-center md:px-6">
      <h2 className="hf-heading mx-auto max-w-2xl text-2xl font-medium sm:text-4xl">
        {MCP_SECTION.title}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm text-white-60 sm:text-base">
        {MCP_SECTION.description}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button href="/mcp" variant="lime">
          {MCP_SECTION.ctaPrimary}
        </Button>
        <Button href="/explore" variant="outline">
          {MCP_SECTION.ctaSecondary}
        </Button>
      </div>
    </section>
  );
}
