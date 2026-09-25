import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth/session";
import { createPortalUrl } from "@/lib/stripe/customer";
import { publicEnv } from "@/lib/env";

export async function POST() {
  const site = publicEnv.siteUrl();
  const profile = await getSessionProfile();
  if (!profile) return NextResponse.redirect(`${site}/login?next=/account`, 303);
  if (!profile.stripe_customer_id) return NextResponse.redirect(`${site}/pricing`, 303);

  try {
    return NextResponse.redirect(await createPortalUrl(profile.stripe_customer_id), 303);
  } catch (err) {
    console.error("billing portal failed", err);
    return NextResponse.redirect(`${site}/account?billing=error`, 303);
  }
}
