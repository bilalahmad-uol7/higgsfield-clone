import { ParamsSidebar } from "@/components/create/ParamsSidebar";
import { JobFeed } from "@/components/create/JobFeed";
import type { GenerationType } from "@/lib/generation/types";

export default async function CreatePage({ searchParams }: PageProps<"/create">) {
  const params = await searchParams;
  const rawType = typeof params.type === "string" ? params.type : undefined;
  const type: GenerationType = rawType === "video" ? "video" : rawType === "image" ? "image" : "video";
  const model = typeof params.model === "string" ? params.model : undefined;
  const preset = typeof params.preset === "string" ? params.preset : undefined;
  const prompt = typeof params.prompt === "string" ? params.prompt : undefined;

  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-8 md:px-6 lg:grid-cols-[360px_1fr]">
      <aside className="rounded-2xl border border-white-8 bg-surface-primary p-5 lg:sticky lg:top-20 lg:h-fit">
        <ParamsSidebar initialType={type} initialModel={model} initialPreset={preset} initialPrompt={prompt} />
      </aside>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h1 className="hf-heading text-xl font-medium">Assets</h1>
        </div>
        <JobFeed />
      </section>
    </div>
  );
}
