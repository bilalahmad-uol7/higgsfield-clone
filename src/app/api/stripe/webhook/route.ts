import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe/server";
import { toAction } from "@/lib/stripe/webhook";
import { fulfill } from "@/lib/stripe/fulfill";
import { requireEnv } from "@/lib/env";
import { jsonError } from "@/lib/api";

// Stripe → us. Authenticated by signature (not cookies), so the proxy
// matcher skips this path. Non-2xx responses make Stripe retry, which is
// safe because fulfillment is idempotent.
export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return jsonError("missing_signature", 400);

  // The signature covers the exact raw bytes, so read the body as text.
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(
      body,
      signature,
      requireEnv("STRIPE_WEBHOOK_SECRET", process.env.STRIPE_WEBHOOK_SECRET),
    );
  } catch (err) {
    console.warn("stripe webhook: bad signature", (err as Error).message);
    return jsonError("invalid_signature", 400);
  }

  const action = toAction(event);
  try {
    await fulfill(action);
  } catch (err) {
    console.error(`stripe webhook: ${event.type} ${event.id} failed`, err);
    return jsonError("fulfillment_failed", 500);
  }

  return NextResponse.json({ received: true, action: action.kind });
}
