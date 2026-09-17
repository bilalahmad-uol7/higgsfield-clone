import { LegalPage } from "@/components/legal/LegalPage";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This is an educational, unaffiliated clone of higgsfield.ai with no backend. It collects
        no personal data, runs no analytics, and has no server-side database — everything you see
        (credits, generation history, form input) lives only in your browser&apos;s local storage.
      </p>
      <p>This project is not affiliated with, endorsed by, or operated by Higgsfield, Inc.</p>
    </LegalPage>
  );
}
