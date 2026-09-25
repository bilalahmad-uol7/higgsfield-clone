import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidJobId } from "@/lib/generation/validate";
import { jsonError } from "@/lib/api";

// Refund a cancelled job. The DB refunds exactly what this user was charged
// for this job id, at most once — replays just return the balance.
export async function POST(_request: Request, ctx: RouteContext<"/api/generations/[jobId]/cancel">) {
  const { jobId } = await ctx.params;
  if (!isValidJobId(jobId)) return jsonError("invalid_params", 400);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError("unauthorized", 401);

  const { data, error } = await createAdminClient().rpc("refund_credits", { p_user: user.id, p_ref: jobId });
  if (error) {
    if (error.message.includes("unknown_job")) return jsonError("unknown_job", 404);
    console.error("refund_credits failed", error);
    return jsonError("server_error", 500);
  }

  return NextResponse.json({ credits: data });
}
