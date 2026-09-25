import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { COMMUNITY_POSTS } from "@/data/community";
import { Media } from "@/components/ui/Media";

export function CommunityGrid() {
  return (
    <div className="mt-8 columns-2 gap-2 sm:columns-3 lg:columns-4 [&>*]:mb-2 [&>*]:break-inside-avoid">
      {COMMUNITY_POSTS.map((post) => (
        <div
          key={post.slug}
          className="group relative overflow-hidden border border-white-10 bg-ink-raised"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Media
              media={post.thumbnail}
              alt={post.title}
              sizes="(min-width: 1024px) 22vw, 45vw"
              className="noir-media"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
            <Link
              href={`/create?type=video&model=${post.model}&prompt=${encodeURIComponent(post.prompt)}`}
              className="slate absolute left-3 right-3 top-3 z-10 flex items-center justify-center bg-rec py-2.5 text-ink opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              Recreate
            </Link>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="display line-clamp-2 text-xl leading-tight text-paper">{post.title}</p>
              <div className="slate mt-2 flex items-center justify-between text-white-60">
                <span>{post.author}</span>
                <span className="flex items-center gap-2">
                  <span className="flex items-center gap-1">
                    <Heart size={12} /> {post.likes.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={12} /> {post.comments}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
