import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isValidJobId } from "@/lib/generation/validate";
import { jsonError } from "@/lib/api";
import { authUserId } from "@/lib/auth/session";

// Cancel a take that is still rolling and refund it. A finished (or failed,
// or already cancelled) job is refused, so output can't be kept for free.
export async function POST(_request: Request, ctx: RouteContext<"/api/generations/[jobId]/cancel">) {
  const { jobId } = await ctx.params;
  if (!isValidJobId(jobId)) return jsonError("invalid_params", 400);

  const supabase = await createClient();
  const userId = await authUserId(supabase);
  if (!userId) return jsonError("unauthorized", 401);

  const { data, error } = await createAdminClient().rpc("cancel_generation", { p_user: userId, p_id: jobId });
  if (error) {
    if (error.message.includes("not_cancellable")) return jsonError("not_cancellable", 409);
    if (error.message.includes("unknown_job")) return jsonError("unknown_job", 404);
    console.error("cancel_generation failed", error);
    return jsonError("server_error", 500);
  }

  return NextResponse.json({ credits: data });
}
