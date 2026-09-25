import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe, PORTAL_CONFIG_TAG } from "@/lib/stripe/server";
import { publicEnv } from "@/lib/env";
import type { SessionProfile } from "@/lib/auth/session";

// One Stripe customer per profile, created on first purchase and linked by id
// (plus user_id metadata) so webhooks can always find the account.
export async function getOrCreateCustomer(profile: SessionProfile) {
  if (profile.stripe_customer_id) return profile.stripe_customer_id;

  const customer = await stripe().customers.create(
    {
      email: profile.email,
      name: profile.full_name ?? undefined,
      metadata: { user_id: profile.id },
    },
    { idempotencyKey: `customer-${profile.id}` },
  );

  const { error } = await createAdminClient()
    .from("profiles")
    .update({ stripe_customer_id: customer.id })
    .eq("id", profile.id);
  if (error) throw new Error(`link customer: ${error.message}`);
  return customer.id;
}

let portalConfigId: string | null | undefined;

// Portal configuration created by `npm run stripe:seed` (plan switching +
// cancel). Falls back to the account's default configuration.
async function portalConfiguration() {
  if (portalConfigId !== undefined) return portalConfigId ?? undefined;
  const { data } = await stripe().billingPortal.configurations.list({ active: true, limit: 100 });
  portalConfigId = data.find((c) => c.metadata?.app === PORTAL_CONFIG_TAG)?.id ?? null;
  return portalConfigId ?? undefined;
}

export async function createPortalUrl(customerId: string) {
  const session = await stripe().billingPortal.sessions.create({
    customer: customerId,
    configuration: await portalConfiguration(),
    return_url: `${publicEnv.siteUrl()}/account`,
  });
  return session.url;
}

