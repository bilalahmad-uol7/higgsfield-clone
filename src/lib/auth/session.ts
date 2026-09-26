import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
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

// The signed-in user's profile, or null. Deduplicated per request, so the
// layout, header and page can all call it without extra round-trips.
// getUser() (not getSession) re-validates the JWT with Supabase Auth.
export const getSessionProfile = cache(async (): Promise<SessionProfile | null> => {
  // Session-dependent output must never be prerendered, even when a build
  // runs without Supabase env vars and we bail out below.
  await connection();
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select(
      "id, email, full_name, avatar_url, provider, role, credits, plan_id, plan_interval, subscription_status, current_period_end, stripe_customer_id",
    )
    .eq("id", user.id)
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
