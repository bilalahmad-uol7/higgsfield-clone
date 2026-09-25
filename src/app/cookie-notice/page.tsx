import { LegalPage } from "@/components/legal/LegalPage";

export default function CookieNoticePage() {
  return (
    <LegalPage title="Cookie Notice">
      <p>
        This is an educational, unaffiliated redesign of higgsfield.ai. It sets only strictly necessary cookies:
        the Supabase session cookies that keep you signed in. Stripe may set its own cookies on its checkout and
        billing pages. There are no tracking or analytics cookies.
      </p>
      <p>Your generation history is kept in your browser&apos;s local storage and cleared when you sign out.</p>
    </LegalPage>
  );
}
