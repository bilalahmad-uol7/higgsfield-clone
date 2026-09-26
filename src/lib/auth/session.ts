import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import type { Profile } from "@/lib/supabase/types";

export type SessionProfile = Pick<
  Profile,
  | "id"
  | "email"
  | "full_name"
  | "avatar_url"
  | "provider"
  | "role"
  | "credits"
  | "plan_id"
  | "plan_interval"
  | "subscription_status"
  | "current_period_end"
  | "stripe_customer_id"
>;

/**
 * The signed-in user's id from the session JWT, or null. `getClaims()`
 * verifies the token's signature locally against the project's cached JWKS
 * (asymmetric signing keys), so unlike `getUser()` it costs no round-trip to
 * Supabase Auth. Deduplicated per request.
 */
export const getAuthUserId = cache(async (): Promise<string | null> => {
  // Session-dependent output must never be prerendered, even when a build
  // runs without Supabase env vars and we bail out below.
  await connection();
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  return authUserId(supabase);
});

/** Verified user id for route handlers that already hold a Supabase client. */
export async function authUserId(supabase: SupabaseClient<Database>): Promise<string | null> {
  const { data } = await supabase.auth.getClaims();
  return data?.claims?.sub ?? null;
}

// The signed-in user's profile, or null. Deduplicated per request, so the
// layout, header and page can all call it without extra round-trips.
export const getSessionProfile = cache(async (): Promise<SessionProfile | null> => {
  const userId = await getAuthUserId();
  if (!userId) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, avatar_url, provider, role, credits, plan_id, plan_interval, subscription_status, current_period_end, stripe_customer_id",
    )
    .eq("id", userId)
    .single();
  return data;
});

export async function requireUser(next: string): Promise<SessionProfile> {
  const profile = await getSessionProfile();
  if (!profile) redirect(`/login?next=${encodeURIComponent(next)}`);
  return profile;
}

// Admin pages 404 for everyone else, so their existence isn't advertised.
export async function requireAdmin(): Promise<SessionProfile> {
  const profile = await getSessionProfile();
  if (!profile || profile.role !== "admin") notFound();
  return profile;
}
