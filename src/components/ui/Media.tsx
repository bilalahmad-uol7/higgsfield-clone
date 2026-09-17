import Image from "next/image";
import { LazyVideo } from "@/components/ui/LazyVideo";
import { mediaUrl, isVideo, type MediaRef } from "@/lib/media";
import { cn } from "@/lib/cn";

export function Media({
  media,
  poster,
  alt,
  className,
  sizes,
}: {
  media: MediaRef;
  poster?: MediaRef;
  alt: string;
  className?: string;
  sizes?: string;
}) {
  const url = mediaUrl(media);

  if (isVideo(url)) {
    return <LazyVideo src={url} poster={poster ? mediaUrl(poster) : undefined} className={className} />;
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      sizes={sizes ?? "(min-width: 1024px) 33vw, 100vw"}
      className={cn("object-cover", className)}
    />
  );
}
