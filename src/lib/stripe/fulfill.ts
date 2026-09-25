import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/server";
import { getPack, parsePlanLookupKey, planCreditsForInvoice } from "@/lib/stripe/catalog";
import type { WebhookAction } from "@/lib/stripe/webhook";
import type { Database } from "@/lib/supabase/database.types";

type Db = ReturnType<typeof createAdminClient>;
type ProfilePatch = Database["public"]["Tables"]["profiles"]["Update"];
type TxInsert = Database["public"]["Tables"]["transactions"]["Insert"];

// Applies a webhook action. Every step is idempotent — the transaction row is
// unique per Stripe object and credit grants are unique per ref — so Stripe's
// retries and replays can't double-record or double-credit.
export async function fulfill(action: WebhookAction) {
  const db = createAdminClient();
  switch (action.kind) {
    case "pack_paid":
      return packPaid(db, action);
    case "subscription_checkout":
      return subscriptionCheckout(db, action);
    case "invoice_paid":
      return invoicePaid(db, action);
    case "subscription_changed":
      return subscriptionChanged(db, action);
    case "ignore":
      return;
  }
}

// Prefer the user id we attached as metadata; fall back to the Stripe
// customer we linked when creating the checkout.
async function resolveUser(db: Db, userId: string | null, customerId: string | null) {
  if (userId) {
    const { data } = await db.from("profiles").select("id").eq("id", userId).maybeSingle();
    if (data) return data.id;
  }
  if (customerId) {
    const { data } = await db.from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle();
    if (data) return data.id;
  }
  return null;
}

async function recordTransaction(db: Db, tx: TxInsert) {
  const { error } = await db
    .from("transactions")
    .upsert(tx, { onConflict: "stripe_object_id", ignoreDuplicates: true });
  if (error) throw new Error(`record transaction ${tx.stripe_object_id}: ${error.message}`);
}

async function grant(db: Db, userId: string, amount: number, ref: string) {
  if (amount <= 0) return;
  const { error } = await db.rpc("grant_credits", {
    p_user: userId,
    p_amount: amount,
    p_reason: "purchase",
    p_ref: ref,
  });
  if (error) throw new Error(`grant credits ${ref}: ${error.message}`);
}

async function patchProfile(db: Db, userId: string, patch: ProfilePatch) {
  const { error } = await db.from("profiles").update(patch).eq("id", userId);
  if (error) throw new Error(`update profile ${userId}: ${error.message}`);
}

async function packPaid(db: Db, a: Extract<WebhookAction, { kind: "pack_paid" }>) {
  const userId = await resolveUser(db, a.userId, a.customerId);
  // Credits come from our catalog, never from metadata a client could shape.
  const credits = getPack(a.packId)?.credits ?? 0;

  await recordTransaction(db, {
    user_id: userId,
    stripe_object_id: a.sessionId,
    stripe_event_id: a.eventId,
    stripe_customer_id: a.customerId,
    kind: "credit_pack",
    plan_id: a.packId,
    amount: a.amount,
    currency: a.currency,
    credits_granted: userId ? credits : 0,
    customer_email: a.email,
  });
  if (userId) await grant(db, userId, credits, a.sessionId);
}

async function subscriptionCheckout(db: Db, a: Extract<WebhookAction, { kind: "subscription_checkout" }>) {
  const userId = await resolveUser(db, a.userId, a.customerId);
  if (!userId) return;
  await patchProfile(db, userId, {
    ...(a.customerId && { stripe_customer_id: a.customerId }),
    ...(a.subscriptionId && { stripe_subscription_id: a.subscriptionId }),
  });
}

function planFields(lookupKey: string | null, status: string, periodEnd: number | null): ProfilePatch {
  const plan = parsePlanLookupKey(lookupKey);
  return {
    plan_id: plan?.planId ?? null,
    plan_interval: plan?.interval ?? null,
    subscription_status: status,
    current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
  };
}

async function invoicePaid(db: Db, a: Extract<WebhookAction, { kind: "invoice_paid" }>) {
  // The invoice only carries a price id; the subscription tells us which plan
  // (by lookup key) and seat count this payment was for — including after a
  // plan switch in the portal, when the original checkout metadata is stale.
  const sub = await stripe().subscriptions.retrieve(a.subscriptionId);
  const item = sub.items.data[0];
  const plan = parsePlanLookupKey(item?.price.lookup_key);
  const userId = await resolveUser(db, a.userId ?? sub.metadata?.user_id ?? null, a.customerId);
  const credits = plan ? planCreditsForInvoice(plan.planId, plan.interval, item?.quantity ?? 1) : 0;

  await recordTransaction(db, {
    user_id: userId,
    stripe_object_id: a.invoiceId,
    stripe_event_id: a.eventId,
    stripe_customer_id: a.customerId,
    kind: a.isFirstPayment ? "subscription" : "renewal",
    plan_id: plan?.planId ?? null,
    plan_interval: plan?.interval ?? null,
    amount: a.amount,
    currency: a.currency,
    credits_granted: userId ? credits : 0,
    customer_email: a.email,
  });
  if (!userId) return;

  await grant(db, userId, credits, a.invoiceId);
  await patchProfile(db, userId, {
    ...planFields(item?.price.lookup_key ?? null, sub.status, item?.current_period_end ?? null),
    stripe_subscription_id: sub.id,
    ...(a.customerId && { stripe_customer_id: a.customerId }),
  });
}

async function subscriptionChanged(db: Db, a: Extract<WebhookAction, { kind: "subscription_changed" }>) {
  const userId = await resolveUser(db, a.userId, a.customerId);
  if (!userId) return;

  if (a.deleted) {
    // Only clear the plan if this is still the user's current subscription.
    const { error } = await db
      .from("profiles")
      .update({
        plan_id: null,
        plan_interval: null,
        subscription_status: "canceled",
        stripe_subscription_id: null,
        current_period_end: null,
      })
      .eq("id", userId)
      .eq("stripe_subscription_id", a.subscriptionId);
    if (error) throw new Error(`clear subscription ${a.subscriptionId}: ${error.message}`);
    return;
  }

  await patchProfile(db, userId, {
    ...planFields(a.lookupKey, a.status, a.periodEnd),
    stripe_subscription_id: a.subscriptionId,
  });
}
