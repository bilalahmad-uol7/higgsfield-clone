import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/database.types";
import type { GenerationParams } from "@/lib/generation/types";
import { executeImageJob } from "@/lib/generation/server/image-job";
import {
  buildPollinationsRequest,
  fetchPollinationsImage,
  isPollinationsDisabled,
} from "@/lib/generation/server/pollinations";

export const GENERATIONS_BUCKET = "generations";

const EXTENSION: Record<string, string> = { "image/png": "png", "image/webp": "webp" };

// Generate, store and finish one charged image job. Runs after the POST
// response has been sent (next/server `after`), so it never throws.
export async function runImageJob(job: { userId: string; jobId: string; params: GenerationParams; deadline: number }) {
  const admin = createAdminClient();
  const bucket = admin.storage.from(GENERATIONS_BUCKET);

  await executeImageJob(job.params, job.deadline, {
    disabled: isPollinationsDisabled(),
    now: Date.now,

    generate: (index, timeoutMs) =>
      fetchPollinationsImage(buildPollinationsRequest(job.params, index, job.jobId), timeoutMs),

    upload: async (index, image) => {
      const path = `${job.userId}/${job.jobId}/${index}.${EXTENSION[image.contentType] ?? "jpg"}`;
      const { error } = await bucket.upload(path, image.bytes, { contentType: image.contentType, upsert: true });
      if (error) throw new Error(`storage_upload_failed: ${error.message}`);
      return { path, url: bucket.getPublicUrl(path).data.publicUrl };
    },

    remove: async (paths) => {
      if (paths.length) await bucket.remove(paths);
    },

    isRunning: async () => {
      const { data } = await admin.from("generations").select("status").eq("id", job.jobId).maybeSingle();
      return data?.status === "running";
    },

    finish: async (results, provider) => {
      const { data, error } = await admin.rpc("finish_generation", {
        p_id: job.jobId,
        p_results: results as unknown as Json,
        p_provider: provider,
      });
      if (error) throw new Error(`finish_failed: ${error.message}`);
      return data === true;
    },

    fail: async (message) => {
      const { error } = await admin.rpc("fail_generation", { p_id: job.jobId, p_error: message });
      if (error) console.error("fail_generation failed", error);
    },
  });
}
