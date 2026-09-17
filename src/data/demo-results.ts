import type { MediaRef } from "@/lib/media";

// Curated pools of real, verified-hotlinkable higgsfield.ai CDN assets used
// as stand-ins for "generated" output in the simulated pipeline.
export const DEMO_VIDEO_POOL: MediaRef[] = [
  { cdn: "card/92c90c2a-ce2f-47bd-8cff-26c90eb9f351.mp4", local: "result-video-1.mp4" },
  { cdn: "card/16eebc9a-8310-4f68-8a02-1e2e6f109169.mp4", local: "result-video-2.mp4" },
  { cdn: "card/8b8270cd-dc63-4a34-88e7-3277536987fb.mp4", local: "result-video-3.mp4" },
  { cdn: "card/31293efb-7438-41c9-84cc-8bc820ce39b6.mp4", local: "result-video-4.mp4" },
  { cdn: "card/4da5ce4e-8483-4471-9564-0907b394d3e0.mp4", local: "result-video-5.mp4" },
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
  { cdn: "card/97dd1c17-15fb-443f-b1fa-f4a155d3c764.webp", local: "result-image-1.webp" },
  { cdn: "card/9c6affe8-03a8-4434-97ef-2fc476f7a71e.webp", local: "result-image-2.webp" },
  { cdn: "card/a8d8030f-9cc9-47ad-a266-e0d3708d2126.webp", local: "result-image-3.webp" },
  { cdn: "card/5fba4d2a-1023-4bd1-9d7a-e2faaf8a21d1.webp", local: "result-image-4.webp" },
  { cdn: "card/f11a402b-0e0e-43cc-90e5-f6cc39352123.webp", local: "result-image-5.webp" },
  { cdn: "viral_hub/95cd0d73-4f3c-40d1-ac0b-c8668a99440b.webp", local: "result-image-6.webp" },
  { cdn: "viral_hub/a1560137-597c-455a-be9e-9622cccf76a3.webp", local: "result-image-7.webp" },
  { cdn: "viral_hub/30142c8a-46ee-4930-aca3-6fa5321dd84a.webp", local: "result-image-8.webp" },
];
