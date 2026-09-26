import "server-only";
import Stripe from "stripe";
import { requireEnv } from "@/lib/env";
import { packLookupKey, planLookupKey, type Interval } from "@/lib/stripe/catalog";

// The SDK pins its own API version, so webhook payload shapes match its types.
let client: Stripe | null = null;

export function stripe() {
  client ??= new Stripe(requireEnv("STRIPE_SECRET_KEY", process.env.STRIPE_SECRET_KEY), {
    appInfo: { name: "higgsfield-noir" },
  });
  return client;
}

const priceCache = new Map<string, string>();

async function priceIdFor(lookupKey: string) {
  const cached = priceCache.get(lookupKey);
  if (cached) return cached;
  const { data } = await stripe().prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  const price = data[0];
  if (!price) throw new Error(`No active Stripe price with lookup key "${lookupKey}". Run \`npm run stripe:seed\`.`);
  priceCache.set(lookupKey, price.id);
  return price.id;
}

export const planPriceId = (planId: string, interval: Interval) => priceIdFor(planLookupKey(planId, interval));
export const packPriceId = (packId: string) => priceIdFor(packLookupKey(packId));

/**
 * Dashboard link for a recorded transaction (test or live, matching the key
 * in use): the invoice for subscription payments, otherwise the customer.
 */
export function stripeDashboardUrl(tx: { stripe_object_id: string; stripe_customer_id: string | null }) {
  const base = `https://dashboard.stripe.com/${process.env.STRIPE_SECRET_KEY?.startsWith("sk_live") ? "" : "test/"}`;
  if (tx.stripe_object_id.startsWith("in_")) return `${base}invoices/${tx.stripe_object_id}`;
  if (tx.stripe_customer_id) return `${base}customers/${tx.stripe_customer_id}`;
  return `${base}payments`;
}

export const PORTAL_CONFIG_TAG = "higgsfield-noir";
