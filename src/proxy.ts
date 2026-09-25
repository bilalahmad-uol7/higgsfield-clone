import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  // Skip static assets, image optimization and the Stripe webhook (which
  // authenticates by signature, not cookies).
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.svg|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)"],
};
