import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidJobId } from "@/lib/generation/validate";
import { rowToJob } from "@/lib/generation/lifecycle";
import { settleGeneration } from "@/lib/generation/server/settle";
import { jsonError } from "@/lib/api";
import { authUserId } from "@/lib/auth/session";

// Status of one of the caller's jobs. Once it has settled, also the caller's
// balance (a failed job is refunded behind the client's back); while it's
// still running — most polls — that's one query, not two.
export async function GET(_request: Request, ctx: RouteContext<"/api/generations/[jobId]">) {
  const { jobId } = await ctx.params;
  if (!isValidJobId(jobId)) return jsonError("invalid_params", 400);

  const supabase = await createClient();
  const userId = await authUserId(supabase);
  if (!userId) return jsonError("unauthorized", 401);

  // Read through the user's session: RLS plus the explicit owner filter mean
  // another user's job id is indistinguishable from a missing one.
  const { data: row } = await supabase
    .from("generations")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", userId)
    .maybeSingle();
  if (!row) return jsonError("unknown_job", 404);

  const settled = await settleGeneration(row);
  let credits: number | undefined;
  if (settled.status !== "running") {
    const { data: profile } = await supabase.from("profiles").select("credits").eq("id", userId).single();
    credits = profile?.credits;
  }

  return NextResponse.json({ job: rowToJob(settled), credits }, { headers: { "cache-control": "no-store" } });
}
