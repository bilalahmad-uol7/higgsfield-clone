import { LegalPage } from "@/components/legal/LegalPage";

export default function TermsOfUsePage() {
  return (
    <LegalPage title="Terms of Use">
      <p>
        This is an educational, unaffiliated clone of higgsfield.ai, built to demonstrate an
        AI-agent-driven development workflow. It is not a commercial product: there is no real
        account system, no payment processing, and no AI generation happening behind the scenes —
        every &quot;generation&quot; on this site is a scripted simulation.
      </p>
      <p>Use it as a demo only. It carries no warranty and no affiliation with Higgsfield, Inc.</p>
    </LegalPage>
  );
}
