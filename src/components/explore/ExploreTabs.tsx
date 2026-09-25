"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TOOLS, TOOL_CATEGORIES } from "@/data/tools";
import { ToolCard } from "@/components/explore/ToolCard";
import { CommunityGrid } from "@/components/explore/CommunityGrid";
import { cn } from "@/lib/cn";

type Tab = (typeof TOOL_CATEGORIES)[number] | "Community";

const TAB_ALIASES: Record<string, Tab> = {
  effects: "Videos",
  community: "Community",
};

function normalizeTab(raw: string | undefined): Tab {
  if (!raw) return "All";
  const alias = TAB_ALIASES[raw.toLowerCase()];
  if (alias) return alias;
  const match = TOOL_CATEGORIES.find((c) => c.toLowerCase() === raw.toLowerCase());
  return match ?? "All";
}

export function ExploreTabs({ initialTab }: { initialTab?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>(() => normalizeTab(initialTab));

  const tabs: Tab[] = [...TOOL_CATEGORIES, "Community"];

  const filtered = useMemo(() => {
    if (tab === "All") return TOOLS;
    if (tab === "New") return TOOLS.filter((t) => t.badge === "New");
    if (tab === "Community") return [];
    return TOOLS.filter((t) => t.category === tab);
  }, [tab]);

  function selectTab(next: Tab) {
    setTab(next);
    router.replace(`/explore?tab=${next.toLowerCase()}`, { scroll: false });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => selectTab(t)}
            className={cn(
              "rounded-pill px-4 py-2 text-sm font-medium transition-colors",
              tab === t ? "bg-rec text-black" : "bg-white-6 text-white-70 hover:bg-white-10",
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Community" ? (
        <CommunityGrid />
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
