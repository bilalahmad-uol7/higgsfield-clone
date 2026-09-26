import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isValidJobId } from "@/lib/generation/validate";
import { rowToJob } from "@/lib/generation/lifecycle";
import { settleGeneration } from "@/lib/generation/server/settle";
import { jsonError } from "@/lib/api";

// Status of one of the caller's jobs, plus their balance (which changes
// behind the client's back when a failed job is refunded).
export async function GET(_request: Request, ctx: RouteContext<"/api/generations/[jobId]">) {
  const { jobId } = await ctx.params;
  if (!isValidJobId(jobId)) return jsonError("invalid_params", 400);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError("unauthorized", 401);

  // Read through the user's session: RLS plus the explicit owner filter mean
  // another user's job id is indistinguishable from a missing one.
  const { data: row } = await supabase
    .from("generations")
    .select("*")
    .eq("id", jobId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!row) return jsonError("unknown_job", 404);

  const settled = await settleGeneration(row);
  const { data: profile } = await supabase.from("profiles").select("credits").eq("id", user.id).single();

  return NextResponse.json(
    { job: rowToJob(settled), credits: profile?.credits ?? 0 },
    { headers: { "cache-control": "no-store" } },
  );
}
