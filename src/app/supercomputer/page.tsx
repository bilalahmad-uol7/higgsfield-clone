import { ComingSoon } from "@/components/ui/ComingSoon";

export default function SupercomputerPage() {
  return (
    <ComingSoon
      title="Supercomputer"
      description="One superagent for your entire creative stack — plans and executes an entire project across every Higgsfield model."
      media={{ cdn: "card/5fba4d2a-1023-4bd1-9d7a-e2faaf8a21d1.webp", local: "tile-supercomputer.webp" }}
      cta={{ label: "Try Create instead", href: "/create" }}
    />
  );
}
