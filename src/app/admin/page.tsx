import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { KIND_LABEL, formatDate, formatMoney, isoDaysAgo } from "@/lib/format";
import { Kpi, Table, Td, Th } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

function sumByCurrency(rows: { amount: number; currency: string }[]) {
  const totals = new Map<string, number>();
  for (const r of rows) totals.set(r.currency, (totals.get(r.currency) ?? 0) + r.amount);
  return [...totals].map(([currency, amount]) => formatMoney(amount, currency)).join(" · ") || formatMoney(0, "usd");
}

export default async function AdminOverview() {
  const db = createAdminClient();
  const since = isoDaysAgo(30);

  const [users, subscribers, revenue, recentTx, latestUsers, latestTx, recentGenerations] = await Promise.all([
    db.from("profiles").select("id", { count: "exact", head: true }),
    db
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .in("subscription_status", ["active", "trialing", "past_due"]),
    db.from("transactions").select("amount, currency"),
    db.from("transactions").select("id", { count: "exact", head: true }).gte("created_at", since),
    db.from("profiles").select("id, email, full_name, provider, created_at").order("created_at", { ascending: false }).limit(5),
    db.from("transactions").select("*").order("created_at", { ascending: false }).limit(5),
    db.from("generations").select("id", { count: "exact", head: true }).gte("created_at", isoDaysAgo(1)),
  ]);

  return (
    <div className="flex flex-col gap-14">
      <div className="grid gap-px border border-white-10 bg-white-10 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Registered users" value={(users.count ?? 0).toLocaleString()} />
        <Kpi label="Active subscribers" value={(subscribers.count ?? 0).toLocaleString()} />
        <Kpi label="Revenue (all time)" value={sumByCurrency(revenue.data ?? [])} hint="Recorded from Stripe webhooks" />
        <Kpi label="Payments · 30 days" value={(recentTx.count ?? 0).toLocaleString()} />
        <Kpi label="Generations · 24h" value={(recentGenerations.count ?? 0).toLocaleString()} />
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="slate text-white-40">Latest signups</h2>
            <Link href="/admin/users" className="slate text-rec">
              All users →
            </Link>
          </div>
          <Table minWidth={460} head={<><Th>User</Th><Th>Via</Th><Th right>Joined</Th></>}>
            {(latestUsers.data ?? []).map((u) => (
              <tr key={u.id}>
                <Td>
                  {u.full_name || "—"}
                  <span className="block text-xs text-white-40">{u.email}</span>
                </Td>
                <Td muted>{u.provider}</Td>
                <Td right muted>{formatDate(u.created_at)}</Td>
              </tr>
            ))}
          </Table>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="slate text-white-40">Latest transactions</h2>
            <Link href="/admin/transactions" className="slate text-rec">
              All transactions →
            </Link>
          </div>
          <Table minWidth={460} head={<><Th>Customer</Th><Th>Type</Th><Th right>Amount</Th></>}>
            {(latestTx.data ?? []).length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-white-40">
                  No payments yet.
                </td>
              </tr>
            )}
            {(latestTx.data ?? []).map((t) => (
              <tr key={t.id}>
                <Td>
                  {t.customer_email ?? "—"}
                  <span className="block text-xs text-white-40">{formatDate(t.created_at, true)}</span>
                </Td>
                <Td muted>{KIND_LABEL[t.kind] ?? t.kind}</Td>
                <Td right>{formatMoney(t.amount, t.currency)}</Td>
              </tr>
            ))}
          </Table>
        </section>
      </div>
    </div>
  );
}
