import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { creditCost } from "@/lib/generation/types";
import { isValidJobId, parseGenerationParams } from "@/lib/generation/validate";
import { jsonError } from "@/lib/api";

// Charge for a generation. The price is computed here from validated params;
// anything the client claims about cost is ignored.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError("unauthorized", 401);

  const body = (await request.json().catch(() => null)) as { jobId?: unknown; params?: unknown } | null;
  const params = parseGenerationParams(body?.params);
  if (!body || !isValidJobId(body.jobId) || !params) return jsonError("invalid_params", 400);

  const { data, error } = await createAdminClient().rpc("spend_credits", {
    p_user: user.id,
    p_amount: creditCost(params),
    p_ref: body.jobId,
  });

  if (error) {
    if (error.message.includes("insufficient_credits")) return jsonError("insufficient_credits", 402);
    if (error.code === "23505") return jsonError("duplicate_job", 409);
    console.error("spend_credits failed", error);
    return jsonError("server_error", 500);
  }

  return NextResponse.json({ credits: data });
}
