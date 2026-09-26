import type Stripe from "stripe";

// Pure translation of Stripe events into the few things our app cares about.
// No I/O here, so it can be unit-tested with fixture events; fulfill.ts does
// the database work.

export type WebhookAction =
  | {
      kind: "pack_paid";
      eventId: string;
      sessionId: string;
      userId: string | null;
      customerId: string | null;
      packId: string | null;
      amount: number;
      currency: string;
      email: string | null;
    }
  | {
      kind: "subscription_checkout";
      userId: string | null;
      customerId: string | null;
      subscriptionId: string | null;
    }
  | {
      kind: "invoice_paid";
      eventId: string;
      invoiceId: string;
      userId: string | null;
      customerId: string | null;
      subscriptionId: string;
      amount: number;
      currency: string;
      email: string | null;
      isFirstPayment: boolean;
    }
  | {
      kind: "subscription_changed";
      subscriptionId: string;
      customerId: string | null;
      userId: string | null;
      deleted: boolean;
      status: string;
      lookupKey: string | null;
      quantity: number;
      periodEnd: number | null;
    }
  | { kind: "ignore"; reason: string };

export function idOf(value: string | { id: string } | null | undefined): string | null {
  if (!value) return null;
  return typeof value === "string" ? value : value.id;
}

export function toAction(event: Stripe.Event): WebhookAction {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const userId = session.client_reference_id ?? session.metadata?.user_id ?? null;
      const customerId = idOf(session.customer);

      if (session.mode === "payment") {
        if (session.payment_status !== "paid") return { kind: "ignore", reason: "payment not settled" };
        return {
          kind: "pack_paid",
          eventId: event.id,
          sessionId: session.id,
          userId,
          customerId,
          packId: session.metadata?.pack_id ?? null,
          amount: session.amount_total ?? 0,
          currency: session.currency ?? "usd",
          email: session.customer_details?.email ?? session.customer_email ?? null,
        };
      }
      if (session.mode === "subscription") {
        return { kind: "subscription_checkout", userId, customerId, subscriptionId: idOf(session.subscription) };
      }
      return { kind: "ignore", reason: `checkout mode ${session.mode}` };
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      const details = invoice.parent?.subscription_details;
      const subscriptionId = idOf(details?.subscription);
      if (!invoice.id || !subscriptionId) return { kind: "ignore", reason: "not a subscription invoice" };
      return {
        kind: "invoice_paid",
        eventId: event.id,
        invoiceId: invoice.id,
        userId: details?.metadata?.user_id ?? null,
        customerId: idOf(invoice.customer),
        subscriptionId,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        email: invoice.customer_email,
        isFirstPayment: invoice.billing_reason === "subscription_create",
      };
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const item = sub.items.data[0];
      return {
        kind: "subscription_changed",
        subscriptionId: sub.id,
        customerId: idOf(sub.customer),
        userId: sub.metadata?.user_id ?? null,
        deleted: event.type === "customer.subscription.deleted",
        status: sub.status,
        lookupKey: item?.price.lookup_key ?? null,
        quantity: item?.quantity ?? 1,
        periodEnd: item?.current_period_end ?? null,
      };
    }

    default:
      return { kind: "ignore", reason: `unhandled ${event.type}` };
  }
}
