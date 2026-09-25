import { LegalPage } from "@/components/legal/LegalPage";

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This is an educational, unaffiliated redesign of higgsfield.ai built as a demo. If you create an account,
        we store your name, email, sign-in provider (email or Google), credit balance and credit history in our
        database (Supabase). Passwords are handled by Supabase Auth and never stored by this app.
      </p>
      <p>
        Payments are processed by Stripe in test mode. We keep a record of each successful payment (amount, plan
        or pack, and the Stripe reference) — never card details. Generation history stays in your browser&apos;s
        local storage. There is no analytics or advertising tracking.
      </p>
      <p>This project is not affiliated with, endorsed by, or operated by Higgsfield, Inc.</p>
    </LegalPage>
  );
}
