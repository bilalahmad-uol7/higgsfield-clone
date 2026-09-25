import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripeDashboardUrl } from "@/lib/stripe/server";
import { getPack, getPlan } from "@/lib/stripe/catalog";
import { KIND_LABEL, formatCredits, formatDate, formatMoney } from "@/lib/format";
import { Pagination, Table, Td, Th, pageParam } from "@/components/admin/ui";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;
const KINDS = ["subscription", "renewal", "credit_pack"] as const;

export default async function AdminTransactions({ searchParams }: PageProps<"/admin/transactions">) {
  const params = await searchParams;
  const kind = KINDS.find((k) => k === params.kind);
  const page = pageParam(params.page);
  const db = createAdminClient();

  let list = db
    .from("transactions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  let totals = db.from("transactions").select("amount, currency");
  if (kind) {
    list = list.eq("kind", kind);
    totals = totals.eq("kind", kind);
  }
  const [{ data: rows, count }, { data: totalRows }] = await Promise.all([list, totals]);

  // Resolve account emails for rows tied to a profile.
  const userIds = [...new Set((rows ?? []).map((r) => r.user_id).filter((id): id is string => Boolean(id)))];
  const { data: owners } = userIds.length
    ? await db.from("profiles").select("id, email").in("id", userIds)
    : { data: [] as { id: string; email: string }[] };
  const emailOf = new Map((owners ?? []).map((o) => [o.id, o.email]));

  const sums = new Map<string, number>();
  for (const t of totalRows ?? []) sums.set(t.currency, (sums.get(t.currency) ?? 0) + t.amount);

  const href = (p: number, k = kind) => `/admin/transactions?${new URLSearchParams({ ...(k && { kind: k }), page: String(p) })}`;
  const tab = (active: boolean) =>
    cn("slate px-4 py-3 transition-colors", active ? "bg-paper text-ink" : "bg-ink text-white-60 hover:text-paper");

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Filter by type" className="flex w-fit gap-px border border-white-10 bg-white-10">
          <Link href="/admin/transactions" className={tab(!kind)}>
            All
          </Link>
          {KINDS.map((k) => (
            <Link key={k} href={href(1, k)} className={tab(kind === k)}>
              {KIND_LABEL[k]}
            </Link>
          ))}
        </nav>
        <p className="slate text-white-60">
          Total ·{" "}
          <span className="text-paper">
            {[...sums].map(([c, a]) => formatMoney(a, c)).join(" · ") || formatMoney(0, "usd")}
          </span>
        </p>
      </div>

      <Table
        minWidth={1000}
        head={
          <>
            <Th>Date</Th>
            <Th>Customer</Th>
            <Th>Type</Th>
            <Th>Item</Th>
            <Th right>Amount</Th>
            <Th right>Credits</Th>
            <Th right>Stripe</Th>
          </>
        }
      >
        {(rows ?? []).length === 0 && (
          <tr>
            <td colSpan={7} className="px-4 py-8 text-white-40">
              No transactions recorded yet. Successful Stripe payments appear here as the webhook receives them.
            </td>
          </tr>
        )}
        {(rows ?? []).map((t) => (
          <tr key={t.id}>
            <Td muted>{formatDate(t.created_at, true)}</Td>
            <Td>
              {(t.user_id && emailOf.get(t.user_id)) ?? t.customer_email ?? "—"}
              {!t.user_id && <span className="block text-xs text-rec">No linked account</span>}
            </Td>
            <Td muted>{KIND_LABEL[t.kind] ?? t.kind}</Td>
            <Td muted>
              {t.kind === "credit_pack"
                ? (getPack(t.plan_id)?.label ?? t.plan_id)
                : `${getPlan(t.plan_id)?.name ?? t.plan_id ?? "—"}${t.plan_interval ? ` · ${t.plan_interval}` : ""}`}
            </Td>
            <Td right>{formatMoney(t.amount, t.currency)}</Td>
            <Td right>{formatCredits(t.credits_granted)}</Td>
            <td className="px-4 py-3 text-right">
              <a
                href={stripeDashboardUrl(t)}
                target="_blank"
                rel="noreferrer"
                className="slate text-white-60 underline decoration-white-24 underline-offset-4 hover:text-paper"
                title={t.stripe_object_id}
              >
                {t.stripe_object_id.slice(0, 14)}…
              </a>
            </td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} pageSize={PAGE_SIZE} total={count ?? 0} href={(p) => href(p)} />
    </div>
  );
}
