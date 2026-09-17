import { LegalPage } from "@/components/legal/LegalPage";

export default function HelpCenterPage() {
  return (
    <LegalPage title="Help Center">
      <p>
        This is an educational, unaffiliated clone of higgsfield.ai built to demonstrate an
        AI-agent-driven development workflow. It has no real support system or account backend.
      </p>
      <p>
        If you&apos;re looking for help with the real Higgsfield product, visit{" "}
        higgsfield.ai directly.
      </p>
    </LegalPage>
  );
}
