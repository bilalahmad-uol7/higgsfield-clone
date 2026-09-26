import { NextResponse, after } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import { creditCost } from "@/lib/generation/types";
import { isValidJobId, parseGenerationParams } from "@/lib/generation/validate";
import { dueAt, initialProvider } from "@/lib/generation/lifecycle";
import { runImageJob } from "@/lib/generation/server/run-image-job";
import { jsonError } from "@/lib/api";

// Image jobs keep running (via `after`) once the response is sent.
export const maxDuration = 300;

// Charge for a generation and start it. The price is computed here from
// validated params; anything the client claims about cost is ignored.
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return jsonError("unauthorized", 401);

  const body = (await request.json().catch(() => null)) as { jobId?: unknown; params?: unknown } | null;
  const params = parseGenerationParams(body?.params);
  if (!body || !isValidJobId(body.jobId) || !params) return jsonError("invalid_params", 400);
  const jobId = body.jobId;
  const due = dueAt(params, jobId, Date.now());

  const { data, error } = await createAdminClient().rpc("start_generation", {
    p_user: user.id,
    p_id: jobId,
    p_type: params.type,
    p_model: params.model,
    p_prompt: params.prompt,
    p_params: params as unknown as Json,
    p_cost: creditCost(params),
    p_provider: initialProvider(params),
    p_due_at: due.toISOString(),
  });

  if (error) {
    if (error.message.includes("insufficient_credits")) return jsonError("insufficient_credits", 402);
    if (error.message.includes("too_many_jobs")) return jsonError("too_many_jobs", 429);
    if (error.code === "23505") return jsonError("duplicate_job", 409);
    console.error("start_generation failed", error);
    return jsonError("server_error", 500);
  }

  // Video is a scripted mock: it completes on a later poll once `due` passes.
  if (params.type === "image") {
    after(() => runImageJob({ userId: user.id, jobId, params, deadline: due.getTime() }));
  }

  return NextResponse.json({ credits: data });
}
