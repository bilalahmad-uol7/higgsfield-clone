import type Stripe from "stripe";
import { describe, expect, it } from "vitest";
import { toAction } from "@/lib/stripe/webhook";

const event = (type: string, object: Record<string, unknown>) =>
  ({ id: "evt_1", type, data: { object } }) as unknown as Stripe.Event;

describe("toAction", () => {
  it("maps a paid credit-pack checkout", () => {
    const action = toAction(
      event("checkout.session.completed", {
        id: "cs_1",
        mode: "payment",
        payment_status: "paid",
        client_reference_id: "user-1",
        customer: "cus_1",
        metadata: { pack_id: "pack-600", user_id: "user-1" },
        amount_total: 3000,
        currency: "usd",
        customer_details: { email: "a@b.co" },
      }),
    );
    expect(action).toEqual({
      kind: "pack_paid",
      eventId: "evt_1",
      sessionId: "cs_1",
      userId: "user-1",
      customerId: "cus_1",
      packId: "pack-600",
      amount: 3000,
      currency: "usd",
      email: "a@b.co",
    });
  });

  it("waits for unpaid (async) checkouts", () => {
    const action = toAction(event("checkout.session.completed", { id: "cs_2", mode: "payment", payment_status: "unpaid" }));
    expect(action.kind).toBe("ignore");
  });

  it("links the subscription on subscription checkout", () => {
    const action = toAction(
      event("checkout.session.completed", {
        id: "cs_3",
        mode: "subscription",
        client_reference_id: "user-1",
        customer: { id: "cus_1" },
        subscription: "sub_1",
      }),
    );
    expect(action).toEqual({ kind: "subscription_checkout", userId: "user-1", customerId: "cus_1", subscriptionId: "sub_1" });
  });

  it("maps first and renewal subscription invoices", () => {
    const invoice = (billing_reason: string) =>
      event("invoice.paid", {
        id: "in_1",
        billing_reason,
        customer: "cus_1",
        customer_email: "a@b.co",
        amount_paid: 2900,
        currency: "usd",
        parent: { subscription_details: { subscription: "sub_1", metadata: { user_id: "user-1" } } },
      });
    const first = toAction(invoice("subscription_create"));
    expect(first).toMatchObject({ kind: "invoice_paid", invoiceId: "in_1", subscriptionId: "sub_1", userId: "user-1", isFirstPayment: true });
    expect(toAction(invoice("subscription_cycle"))).toMatchObject({ isFirstPayment: false });
  });

  it("ignores one-off invoices without a subscription", () => {
    expect(toAction(event("invoice.paid", { id: "in_2", parent: null })).kind).toBe("ignore");
  });

  it("maps subscription updates and deletions", () => {
    const sub = {
      id: "sub_1",
      customer: "cus_1",
      status: "active",
      metadata: { user_id: "user-1" },
      items: { data: [{ quantity: 2, current_period_end: 1_900_000_000, price: { lookup_key: "plan_team_monthly" } }] },
    };
    expect(toAction(event("customer.subscription.updated", sub))).toEqual({
      kind: "subscription_changed",
      subscriptionId: "sub_1",
      customerId: "cus_1",
      userId: "user-1",
      deleted: false,
      status: "active",
      lookupKey: "plan_team_monthly",
      quantity: 2,
      periodEnd: 1_900_000_000,
    });
    expect(toAction(event("customer.subscription.deleted", { ...sub, status: "canceled" }))).toMatchObject({
      deleted: true,
      status: "canceled",
    });
  });

  it("ignores events we don't handle", () => {
    expect(toAction(event("charge.refunded", {})).kind).toBe("ignore");
  });
});
