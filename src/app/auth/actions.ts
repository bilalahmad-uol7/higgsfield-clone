"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { publicEnv } from "@/lib/env";
import { safeNext } from "@/lib/auth/redirect";

export type AuthState = {
  error?: string;
  message?: string;
  email?: string;
  fullName?: string;
} | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function field(formData: FormData, name: string) {
  const v = formData.get(name);
  return typeof v === "string" ? v.trim() : "";
}

// Supabase error codes → copy a user can act on.
function friendly(code: string | undefined, fallback: string) {
  switch (code) {
    case "invalid_credentials":
      return "Wrong email or password.";
    case "user_already_exists":
    case "email_exists":
      return "An account with this email already exists — log in instead.";
    case "email_not_confirmed":
      return "Confirm your email first — check your inbox for the link.";
    case "weak_password":
      return `Choose a stronger password (at least ${MIN_PASSWORD} characters).`;
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Too many attempts. Wait a minute and try again.";
    default:
      return fallback;
  }
}

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = field(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(field(formData, "next"));

  if (!EMAIL.test(email) || !password) return { error: "Enter your email and password.", email };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: friendly(error.code, error.message), email };

  redirect(next);
}

export async function signUp(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const fullName = field(formData, "full_name");
  const email = field(formData, "email");
  const password = String(formData.get("password") ?? "");
  const next = safeNext(field(formData, "next"));

  if (!fullName) return { error: "Tell us your name.", email, fullName };
  if (!EMAIL.test(email)) return { error: "Enter a valid email address.", email, fullName };
  if (password.length < MIN_PASSWORD) {
    return { error: `Password must be at least ${MIN_PASSWORD} characters.`, email, fullName };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
      emailRedirectTo: `${publicEnv.siteUrl()}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });
  if (error) return { error: friendly(error.code, error.message), email, fullName };

  // With "Confirm email" off, Supabase returns a live session immediately.
  if (data.session) redirect(next);

  return { message: `Check ${email} for a confirmation link to finish signing up.`, email, fullName };
}

export async function signInWithGoogle(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const next = safeNext(field(formData, "next"));
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${publicEnv.siteUrl()}/auth/callback?next=${encodeURIComponent(next)}` },
  });
  if (error || !data.url) return { error: "Google sign-in is unavailable right now. Try email instead." };

  redirect(data.url);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
