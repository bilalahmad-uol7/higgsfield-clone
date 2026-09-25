import Link from "next/link";
import { Media } from "@/components/ui/Media";
import { Badge } from "@/components/ui/Badge";
import type { MediaRef } from "@/lib/media";

export function ComingSoon({
  title,
  description,
  media,
  cta,
}: {
  title: string;
  description: string;
  media: MediaRef;
  cta?: { label: string; href: string };
}) {
  return (
    <div className="mx-auto max-w-[1000px] px-4 py-14 md:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-white-8 bg-surface-primary">
        <div className="relative aspect-[16/9] w-full">
          <Media media={media} alt={title} sizes="1000px" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6 sm:p-8">
            <Badge tone="rec" className="w-fit">
              Coming soon
            </Badge>
            <h1 className="hf-heading text-2xl font-medium text-white sm:text-3xl">{title}</h1>
            <p className="max-w-lg text-sm text-white-80 sm:text-base">{description}</p>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href={cta?.href ?? "/explore"}
          className="rounded-pill bg-rec px-5 py-2.5 text-sm font-semibold text-black hover:brightness-95"
        >
          {cta?.label ?? "Explore what's live"}
        </Link>
        <Link
          href="/"
          className="rounded-pill border border-white-16 px-5 py-2.5 text-sm font-medium text-white-90 hover:bg-white-6"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
