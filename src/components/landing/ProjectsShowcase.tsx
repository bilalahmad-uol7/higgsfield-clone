import Link from "next/link";
import { PROJECTS } from "@/data/landing";
import { Media } from "@/components/ui/Media";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function ProjectsShowcase() {
  return (
    <section className="mx-auto mt-14 max-w-[1400px] px-4 md:px-6">
      <h2 className="hf-heading text-2xl font-medium sm:text-4xl">Explore the inside of every project</h2>
      <p className="mt-2 max-w-lg text-sm text-white-60 sm:text-base">
        See all prompts, assets, and how each project was created
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {PROJECTS.map((project) => (
          <Link
            key={project.slug}
            href={`/explore?tab=community&project=${project.slug}`}
            className="group flex flex-col gap-2 rounded-2xl border border-white-8 bg-surface-primary p-2.5 transition-colors hover:border-white-16"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-surface-tertiary">
              <Media media={project.thumbnail} alt={project.title} sizes="(min-width: 1024px) 22vw, 45vw" />
              <Badge tone="neutral" className="absolute left-2 top-2">
                {project.visibility}
              </Badge>
            </div>
            <div className="px-1 pb-1">
              <p className="line-clamp-2 text-sm font-medium text-white-90">{project.title}</p>
              <p className="mt-0.5 text-xs text-white-40">by {project.author}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex justify-center">
        <Button href="/explore?tab=community" variant="outline">
          Explore community
        </Button>
      </div>
    </section>
  );
}
