import type { MediaRef } from "@/lib/media";

// Curated pools of real, verified-hotlinkable higgsfield.ai CDN assets used
// as stand-ins for "generated" output in the simulated pipeline.
// Only text-free footage: the `card/*` promo clips carry baked-in captions and
// UI that read as ads, not as a generated take.
export const DEMO_VIDEO_POOL: MediaRef[] = [
  { staticCdn: "promotions/seedance_2_5_explore_image.mp4", local: "result-video-1.mp4" },
  { cdn: "viral_hub/d877f71c-d2f3-44df-9317-f3ce6889bcb6.mp4", local: "result-video-6.mp4" },
  { cdn: "viral_hub/c129fb83-2014-4a37-a3f8-6c7dfeab0254.mp4", local: "result-video-7.mp4" },
  { cdn: "viral_hub/dba03734-6e8a-4337-acb4-17ce943563d8.mp4", local: "result-video-8.mp4" },
  {
    cdn: "user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094513_629920b7-4009-46de-b3b6-b80cc2185275_min.mp4",
    local: "result-video-9.mp4",
  },
  {
    cdn: "user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094445_b0de712b-ae62-4fb9-9b07-2757b2d0338b_min.mp4",
    local: "result-video-10.mp4",
  },
];

export const DEMO_IMAGE_POOL: MediaRef[] = [
  { cdn: "viral_hub/05201733-c72f-43ed-8393-8b8cea28b8ce.webp", local: "result-image-1.webp" },
  { cdn: "viral_hub/5354ce11-c68c-45a0-8a97-5aab94f52833.webp", local: "result-image-2.webp" },
  { cdn: "viral_hub/99aa3365-5ae0-4616-9722-ce0dc087607d.webp", local: "result-image-3.webp" },
  { cdn: "viral_hub/4a2315f6-57e1-4378-82a5-598ddbbfbbcb.webp", local: "result-image-4.webp" },
  { cdn: "viral_hub/95cd0d73-4f3c-40d1-ac0b-c8668a99440b.webp", local: "result-image-6.webp" },
  { cdn: "viral_hub/a1560137-597c-455a-be9e-9622cccf76a3.webp", local: "result-image-7.webp" },
  { cdn: "viral_hub/30142c8a-46ee-4930-aca3-6fa5321dd84a.webp", local: "result-image-8.webp" },
];
