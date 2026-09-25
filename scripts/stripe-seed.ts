// Creates (or reuses) the Stripe test-mode catalog the app sells:
//   • one product per plan with a monthly + an annual recurring price
//   • one product per credit pack with a one-time price
//   • a Customer Portal configuration that allows switching plans and cancelling
// Idempotent: prices are matched by lookup key, products/config by metadata.
//
//   npm run stripe:seed
import Stripe from "stripe";
import { PLANS } from "../src/data/pricing";
import {
  INTERVALS,
  PURCHASABLE_PACKS,
  packLookupKey,
  planLookupKey,
  planUnitAmount,
} from "../src/lib/stripe/catalog";

const TAG = "higgsfield-noir";
const key = process.env.STRIPE_SECRET_KEY;
if (!key) throw new Error("STRIPE_SECRET_KEY missing — run with --env-file=.env.local");
if (key.startsWith("sk_live")) throw new Error("Refusing to seed a LIVE Stripe account. Use a test key.");
const stripe = new Stripe(key);

async function findOrCreateProduct(appId: string, name: string, description: string) {
  const found = await stripe.products.search({ query: `metadata['app_id']:'${appId}' AND active:'true'` });
  if (found.data[0]) return found.data[0];
  return stripe.products.create({ name, description, metadata: { app: TAG, app_id: appId } });
}

async function ensurePrice(params: Stripe.PriceCreateParams & { lookup_key: string }) {
  const existing = await stripe.prices.list({ lookup_keys: [params.lookup_key], active: true, limit: 1 });
  if (existing.data[0]) return { price: existing.data[0], created: false };
  return { price: await stripe.prices.create(params), created: true };
}

const planPrices: { product: string; prices: string[] }[] = [];

for (const plan of PLANS) {
  const product = await findOrCreateProduct(`plan_${plan.id}`, `Higgsfield ${plan.name}`, plan.description);
  const prices: string[] = [];
  for (const interval of INTERVALS) {
    const { price, created } = await ensurePrice({
      product: product.id,
      currency: "usd",
      unit_amount: planUnitAmount(plan, interval),
      recurring: { interval: interval === "monthly" ? "month" : "year" },
      lookup_key: planLookupKey(plan.id, interval),
      nickname: `${plan.name} ${interval}${plan.unit === "seat" ? " (per seat)" : ""}`,
      metadata: { app: TAG, plan_id: plan.id, interval },
    });
    prices.push(price.id);
    console.log(`${created ? "created" : "exists "}  ${price.lookup_key}  $${(price.unit_amount ?? 0) / 100}`);
  }
  planPrices.push({ product: product.id, prices });
}

for (const pack of PURCHASABLE_PACKS) {
  const product = await findOrCreateProduct(`pack_${pack.id}`, `Higgsfield ${pack.label}`, pack.detail);
  const { price, created } = await ensurePrice({
    product: product.id,
    currency: "usd",
    unit_amount: pack.price * 100,
    lookup_key: packLookupKey(pack.id),
    nickname: pack.label,
    metadata: { app: TAG, pack_id: pack.id, credits: String(pack.credits) },
  });
  console.log(`${created ? "created" : "exists "}  ${price.lookup_key}  $${(price.unit_amount ?? 0) / 100}`);
}

const configs = await stripe.billingPortal.configurations.list({ active: true, limit: 100 });
const portal = configs.data.find((c) => c.metadata?.app === TAG);
const features: Stripe.BillingPortal.ConfigurationCreateParams.Features = {
  customer_update: { enabled: true, allowed_updates: ["email", "name"] },
  invoice_history: { enabled: true },
  payment_method_update: { enabled: true },
  subscription_cancel: { enabled: true, mode: "at_period_end" },
  subscription_update: {
    enabled: true,
    default_allowed_updates: ["price", "quantity"],
    proration_behavior: "create_prorations",
    products: planPrices,
  },
};
if (portal) {
  await stripe.billingPortal.configurations.update(portal.id, { features });
  console.log(`updated  portal configuration ${portal.id}`);
} else {
  const created = await stripe.billingPortal.configurations.create({
    business_profile: { headline: "Higgsfield — manage your plan" },
    features,
    metadata: { app: TAG },
  });
  console.log(`created  portal configuration ${created.id}`);
}
