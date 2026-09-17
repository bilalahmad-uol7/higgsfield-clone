import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { COMMUNITY_POSTS } from "@/data/community";
import { Media } from "@/components/ui/Media";

export function CommunityGrid() {
  return (
    <div className="mt-6 columns-2 gap-3 sm:columns-3 lg:columns-4 [&>*]:mb-3 [&>*]:break-inside-avoid">
      {COMMUNITY_POSTS.map((post) => (
        <div
          key={post.slug}
          className="group relative overflow-hidden rounded-2xl border border-white-8 bg-surface-primary"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Media media={post.thumbnail} alt={post.title} sizes="(min-width: 1024px) 22vw, 45vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            <Link
              href={`/create?type=video&model=${post.model}&prompt=${encodeURIComponent(post.prompt)}`}
              className="absolute bottom-3 left-3 right-3 flex items-center justify-center rounded-pill bg-white/95 py-2 text-xs font-semibold text-black opacity-0 transition-opacity group-hover:opacity-100"
            >
              Recreate
            </Link>
            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="line-clamp-2 text-sm font-medium text-white">{post.title}</p>
              <div className="mt-1 flex items-center justify-between text-xs text-white-70">
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
