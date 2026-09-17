import type { MediaRef } from "@/lib/media";
import { PROJECTS } from "@/data/landing";

export type CommunityPost = {
  slug: string;
  title: string;
  author: string;
  prompt: string;
  model: string;
  likes: number;
  comments: number;
  thumbnail: MediaRef;
};

const STUDIO_POSTS: CommunityPost[] = PROJECTS.map((p, i) => ({
  slug: p.slug,
  title: p.title,
  author: p.author,
  prompt: p.title,
  model: ["cinema-studio", "genjutsu", "seedance-2.5", "soul"][i % 4],
  likes: 800 + i * 137,
  comments: 20 + i * 6,
  thumbnail: p.thumbnail,
}));

// Additional community-authored posts, sourced from real (opaque, non-identifying)
// higgsfield.ai CDN generation folders sampled from the live homepage.
const EXTRA_POSTS: CommunityPost[] = [
  {
    slug: "neon-alley-chase",
    title: "Neon alley chase",
    author: "@midnight.render",
    prompt: "A rain-soaked neon alley, chase sequence, crash zoom in on the runner",
    model: "genjutsu",
    likes: 1423,
    comments: 58,
    thumbnail: {
      cdn: "user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094513_629920b7-4009-46de-b3b6-b80cc2185275_thumbnail_min.webp",
      local: "community-neon-alley.webp",
    },
  },
  {
    slug: "glass-orchard",
    title: "Glass orchard",
    author: "@studio.aya",
    prompt: "Surreal orchard made of glass, dolly zoom reveal, golden hour",
    model: "soul",
    likes: 986,
    comments: 31,
    thumbnail: {
      cdn: "user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094445_b0de712b-ae62-4fb9-9b07-2757b2d0338b_thumbnail_min.webp",
      local: "community-glass-orchard.webp",
    },
  },
  {
    slug: "desert-convoy",
    title: "Desert convoy",
    author: "@ren.frames",
    prompt: "Convoy of vintage trucks crossing a red desert, FPV drone follow",
    model: "cinema-studio",
    likes: 2210,
    comments: 74,
    thumbnail: {
      cdn: "user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094417_ba8bf934-a387-4bf5-8a24-f34be2a65d46_thumbnail_min.webp",
      local: "community-desert-convoy.webp",
    },
  },
  {
    slug: "paper-city",
    title: "Paper city",
    author: "@folds",
    prompt: "A city built entirely from folded paper, 360 orbit, soft studio light",
    model: "nano-banana-pro",
    likes: 671,
    comments: 19,
    thumbnail: {
      cdn: "user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094509_a0443ee0-fd26-4f6a-9938-ee153fde5822_thumbnail_min.webp",
      local: "community-paper-city.webp",
    },
  },
  {
    slug: "coral-drift",
    title: "Coral drift",
    author: "@deep.blue",
    prompt: "Bioluminescent coral reef, bullet time around a diver, teal and violet grade",
    model: "seedance-2.5",
    likes: 3040,
    comments: 112,
    thumbnail: {
      cdn: "user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094615_1849e0bf-3c53-4790-80d7-d83d03968910_thumbnail_min.webp",
      local: "community-coral-drift.webp",
    },
  },
  {
    slug: "clockwork-market",
    title: "Clockwork market",
    author: "@brass.and.bone",
    prompt: "Steampunk night market, whip pan across stalls, warm lantern light",
    model: "cinema-studio",
    likes: 1188,
    comments: 43,
    thumbnail: {
      cdn: "user_3AvFCf0aoS6DTSHhwoX3QgsDzIR/hf_20260409_094601_f698d8f7-c96a-42c6-ad0c-8e830417201e_thumbnail_min.webp",
      local: "community-clockwork-market.webp",
    },
  },
];

export const COMMUNITY_POSTS: CommunityPost[] = [...STUDIO_POSTS, ...EXTRA_POSTS];
