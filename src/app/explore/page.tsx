import { ExploreTabs } from "@/components/explore/ExploreTabs";

export default async function ExplorePage({ searchParams }: PageProps<"/explore">) {
  const params = await searchParams;
  const tab = typeof params.tab === "string" ? params.tab : undefined;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10 md:px-6">
      <h1 className="hf-heading text-2xl font-medium sm:text-4xl">Explore</h1>
      <p className="mt-2 max-w-xl text-sm text-white-60 sm:text-base">
        Every tool, model, and community project in one place.
      </p>

      <div className="mt-8">
        <ExploreTabs initialTab={tab} />
      </div>
    </div>
  );
}
