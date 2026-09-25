import { ExploreTabs } from "@/components/explore/ExploreTabs";
import { SectionHead } from "@/components/layout/SectionHead";

export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  const params = await searchParams;
  const tab = typeof params.tab === "string" ? params.tab : undefined;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-16 md:px-8 md:pt-24">
      <SectionHead
        level={1}
        scene={1}
        label="Explore"
        title={
          <>
            The whole <em>backlot.</em>
          </>
        }
        aside="Every tool, model and community project in one place. Hover a card to roll it."
      />

      <div className="mt-14">
        <ExploreTabs initialTab={tab} />
      </div>
    </div>
  );
}
