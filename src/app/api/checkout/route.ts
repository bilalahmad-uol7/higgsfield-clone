import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth/session";
import { stripe, packPriceId, planPriceId } from "@/lib/stripe/server";
import { ACTIVE_STATUSES, getPack, getPlan, isInterval } from "@/lib/stripe/catalog";
import { createPortalUrl, getOrCreateCustomer } from "@/lib/stripe/customer";
import { publicEnv } from "@/lib/env";

// Posted by the pricing forms. Responds with a 303 to Stripe Checkout (or to
// the portal / login), so it works without any client-side JavaScript.
export async function POST(request: Request) {
  const site = publicEnv.siteUrl();
  const back = (path: string) => NextResponse.redirect(`${site}${path}`, 303);

  const profile = await getSessionProfile();
  if (!profile) return back(`/signup?next=${encodeURIComponent("/pricing")}`);

  const form = await request.formData();
  const kind = form.get("kind");

  try {
    const customer = await getOrCreateCustomer(profile);

    if (kind === "plan") {
      const plan = getPlan(String(form.get("planId")));
      const interval = form.get("interval");
      if (!plan || !isInterval(interval)) return back("/pricing?checkout=invalid");

      // Already subscribed: switch plans in the portal rather than stacking
      // a second subscription.
      if (profile.stripe_customer_id && ACTIVE_STATUSES.has(profile.subscription_status ?? "")) {
        return NextResponse.redirect(await createPortalUrl(profile.stripe_customer_id), 303);
      }

      const metadata = { user_id: profile.id, plan_id: plan.id, interval };
      const session = await stripe().checkout.sessions.create({
        mode: "subscription",
        customer,
        client_reference_id: profile.id,
        line_items: [
          {
            price: await planPriceId(plan.id, interval),
            quantity: 1,
            ...(plan.unit === "seat" && { adjustable_quantity: { enabled: true, minimum: 1, maximum: 50 } }),
          },
        ],
        metadata,
        subscription_data: { metadata },
        allow_promotion_codes: true,
        success_url: `${site}/account?checkout=success`,
        cancel_url: `${site}/pricing?checkout=cancelled`,
      });
      return NextResponse.redirect(session.url!, 303);
    }

    if (kind === "pack") {
      const pack = getPack(String(form.get("packId")));
      if (!pack) return back("/pricing?checkout=invalid");

      const session = await stripe().checkout.sessions.create({
        mode: "payment",
        customer,
        client_reference_id: profile.id,
        line_items: [{ price: await packPriceId(pack.id), quantity: 1 }],
        metadata: { user_id: profile.id, pack_id: pack.id },
        payment_intent_data: { metadata: { user_id: profile.id, pack_id: pack.id } },
        success_url: `${site}/account?checkout=success`,
        cancel_url: `${site}/pricing?checkout=cancelled`,
      });
      return NextResponse.redirect(session.url!, 303);
    }

    return back("/pricing?checkout=invalid");
  } catch (err) {
    console.error("checkout failed", err);
    return back("/pricing?checkout=error");
  }
}
