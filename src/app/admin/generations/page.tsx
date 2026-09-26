import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/format";
import { Pagination, Pill, Table, Td, Th, pageParam } from "@/components/admin/ui";
import { Media } from "@/components/ui/Media";
import type { JobResult } from "@/lib/generation/types";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;
const STATUSES = ["running", "complete", "failed", "cancelled"] as const;
const TYPES = ["image", "video"] as const;

const PROVIDER_LABEL: Record<string, string> = {
  pollinations: "Pollinations",
  "pollinations+fallback": "Pollinations + samples",
  mock: "Mock video",
  "mock-fallback": "Samples (fallback)",
};

const STATUS_TONE: Record<string, "neutral" | "rec" | "paper"> = {
  running: "rec",
  complete: "paper",
  failed: "rec",
  cancelled: "neutral",
};

export default async function AdminGenerations({ searchParams }: PageProps<"/admin/generations">) {
  const params = await searchParams;
  const status = STATUSES.find((s) => s === params.status);
  const type = TYPES.find((t) => t === params.type);
  const page = pageParam(params.page);
  const db = createAdminClient();

  let list = db
    .from("generations")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (status) list = list.eq("status", status);
  if (type) list = list.eq("type", type);
  const { data: rows, count } = await list;

  const userIds = [...new Set((rows ?? []).map((r) => r.user_id))];
  const { data: owners } = userIds.length
    ? await db.from("profiles").select("id, email").in("id", userIds)
    : { data: [] as { id: string; email: string }[] };
  const emailOf = new Map((owners ?? []).map((o) => [o.id, o.email]));

  const href = (p: number, s = status, t = type) =>
    `/admin/generations?${new URLSearchParams({ ...(s && { status: s }), ...(t && { type: t }), page: String(p) })}`;
  const tab = (active: boolean) =>
    cn("slate px-4 py-3 transition-colors", active ? "bg-paper text-ink" : "bg-ink text-white-60 hover:text-paper");

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Filter by status" className="flex w-fit flex-wrap gap-px border border-white-10 bg-white-10">
          <Link href={href(1, undefined)} className={tab(!status)}>
            All
          </Link>
          {STATUSES.map((s) => (
            <Link key={s} href={href(1, s)} className={tab(status === s)}>
              {s}
            </Link>
          ))}
        </nav>
        <nav aria-label="Filter by type" className="flex w-fit gap-px border border-white-10 bg-white-10">
          <Link href={href(1, status, undefined)} className={tab(!type)}>
            Any type
          </Link>
          {TYPES.map((t) => (
            <Link key={t} href={href(1, status, t)} className={tab(type === t)}>
              {t}
            </Link>
          ))}
        </nav>
      </div>

      <Table
        minWidth={1100}
        head={
          <>
            <Th>Date</Th>
            <Th>Output</Th>
            <Th>User</Th>
            <Th>Prompt</Th>
            <Th>Model</Th>
            <Th>Source</Th>
            <Th>Status</Th>
            <Th right>Credits</Th>
          </>
        }
      >
        {(rows ?? []).length === 0 && (
          <tr>
            <td colSpan={8} className="px-4 py-8 text-white-40">
              No generations yet. Takes rolled in the studio appear here.
            </td>
          </tr>
        )}
        {(rows ?? []).map((g) => {
          const first = ((g.results ?? []) as JobResult[])[0];
          return (
            <tr key={g.id}>
              <Td muted>{formatDate(g.created_at, true)}</Td>
              <td className="px-4 py-3">
                <div className="relative h-12 w-20 overflow-hidden bg-ink">
                  {first ? (
                    <Media media={first.media} alt="" sizes="80px" />
                  ) : (
                    <span className="slate absolute inset-0 flex items-center justify-center text-white-24">—</span>
                  )}
                </div>
              </td>
              <Td>{emailOf.get(g.user_id) ?? "—"}</Td>
              <Td muted>
                <span className="line-clamp-2 max-w-72" title={g.prompt}>
                  {g.prompt}
                </span>
              </Td>
              <Td muted>
                {g.model}
                <span className="block text-xs text-white-40">{g.type}</span>
              </Td>
              <Td muted>{PROVIDER_LABEL[g.provider] ?? g.provider}</Td>
              <Td>
                <Pill tone={STATUS_TONE[g.status] ?? "neutral"}>{g.status}</Pill>
                {g.error && <span className="block text-xs text-white-40">{g.error}</span>}
              </Td>
              <Td right>
                {g.status === "failed" || g.status === "cancelled" ? (
                  <span className="text-white-40 line-through">{g.cost}</span>
                ) : (
                  g.cost
                )}
              </Td>
            </tr>
          );
        })}
      </Table>
      <Pagination page={page} pageSize={PAGE_SIZE} total={count ?? 0} href={(p) => href(p)} />
    </div>
  );
}
