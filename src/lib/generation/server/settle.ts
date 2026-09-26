import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/supabase/database.types";
import type { GenerationRow } from "@/lib/supabase/types";
import type { GenerationParams } from "@/lib/generation/types";
import { mockVideoResults, settleAction } from "@/lib/generation/lifecycle";

/**
 * Brings a running job up to date on read: completes a mock video whose
 * render time has passed, and fails (refunding) an image job whose worker
 * died. Returns the row as it now stands. Safe to race — every transition
 * in the database only applies to a job that is still running.
 */
export async function settleGeneration(row: GenerationRow): Promise<GenerationRow> {
  const action = settleAction(row, Date.now());
  if (action === "none") return row;

  const admin = createAdminClient();
  if (action === "complete-mock") {
    const results = mockVideoResults(row.params as GenerationParams);
    const { error } = await admin.rpc("finish_generation", { p_id: row.id, p_results: results as unknown as Json });
    if (error) console.error("finish_generation (mock) failed", error);
  } else {
    const { error } = await admin.rpc("fail_generation", { p_id: row.id, p_error: "worker_timeout" });
    if (error) console.error("fail_generation (stale) failed", error);
  }

  const { data } = await admin.from("generations").select("*").eq("id", row.id).single();
  return data ?? row;
}

/**
 * The signed-in user's latest takes, settled — what the studio and account
 * pages show. Read through the user's own session, so RLS also limits it to
 * their rows.
 */
export async function recentGenerations(userId: string, limit: number): Promise<GenerationRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("generations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("recent generations query failed", error);
    return [];
  }
  return Promise.all(data.map(settleGeneration));
}
