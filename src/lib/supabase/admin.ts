import "server-only";
import { createClient } from "@supabase/supabase-js";
import { publicEnv, requireEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

// Service-role client: bypasses RLS. Only for trusted server paths — the
// Stripe webhook, credit APIs and admin pages — after the caller has been
// authorized. Never import this from client code.
export function createAdminClient() {
  return createClient<Database>(
    publicEnv.supabaseUrl(),
    requireEnv("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
