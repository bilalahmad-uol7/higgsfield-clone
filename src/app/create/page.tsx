import { ParamsSidebar } from "@/components/create/ParamsSidebar";
import { JobFeed } from "@/components/create/JobFeed";
import type { GenerationType } from "@/lib/generation/types";
import { requireUser } from "@/lib/auth/session";

export default async function CreatePage({ searchParams }: PageProps<"/create">) {
  const params = await searchParams;
  const rawType = typeof params.type === "string" ? params.type : undefined;
  const type: GenerationType = rawType === "video" ? "video" : rawType === "image" ? "image" : "video";
  const model = typeof params.model === "string" ? params.model : undefined;
  const preset = typeof params.preset === "string" ? params.preset : undefined;
  const prompt = typeof params.prompt === "string" ? params.prompt : undefined;

  const query = new URLSearchParams(
    Object.entries(params).flatMap(([k, v]) => (typeof v === "string" ? [[k, v]] : [])),
  ).toString();
  const profile = await requireUser(`/create${query ? `?${query}` : ""}`);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-20 pt-10 md:px-8">
      <div className="flex flex-col gap-3 border-b border-white-10 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="slate flex items-center gap-3 text-white-60">
            <span className="text-rec">Stage A</span>
            <span className="h-px w-8 bg-white-24" />
            {type === "video" ? "Motion" : "Stills"}
          </p>
          <h1 className="display mt-4 text-5xl md:text-6xl">
            The <em>studio.</em>
          </h1>
        </div>
        <p className="max-w-sm text-sm text-white-60 md:text-right">
          Set the camera on the left and roll. Each take is charged to your account; cut a take early and the credits come back.
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
        <aside className="min-w-0 border border-white-10 bg-ink-raised p-5 lg:sticky lg:top-20 lg:h-fit">
          <p className="slate mb-6 border-b border-white-10 pb-4 text-white-40">Camera settings</p>
          <ParamsSidebar
            initialType={type}
            initialModel={model}
            initialPreset={preset}
            initialPrompt={prompt}
            initialCredits={profile.credits}
          />
        </aside>

        <section aria-label="Dailies" className="min-w-0">
          <p className="slate mb-4 text-white-40">Dailies</p>
          <JobFeed />
        </section>
      </div>
    </div>
  );
}
