import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthUserId, requireUser } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { ACTIVE_STATUSES, getPack, getPlan } from "@/lib/stripe/catalog";
import { KIND_LABEL, REASON_LABEL, formatCredits, formatDate, formatMoney } from "@/lib/format";
import { SectionHead } from "@/components/layout/SectionHead";
import { Media } from "@/components/ui/Media";
import { HISTORY_LIMIT, type JobResult } from "@/lib/generation/types";
import { recentGenerations } from "@/lib/generation/server/settle";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Account" };

const NOTICES: Record<string, string> = {
  success: "Payment received. Your plan and credits update within a few seconds — refresh if they haven't yet.",
};

export default async function AccountPage({ searchParams }: PageProps<"/account">) {
  const { checkout, billing } = await searchParams;
  const supabase = await createClient();
  const userId = await getAuthUserId();
  if (!userId) redirect("/login?next=%2Faccount");

  // Everything loads in parallel. Owner filters are explicit: RLS alone
  // would let an admin's account page list every user's rows.
  const [profile, { data: purchases }, { data: ledger }, takes] = await Promise.all([
    requireUser("/account"),
    supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("credit_ledger")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(15),
    recentGenerations(userId, HISTORY_LIMIT),
  ]);

  const plan = getPlan(profile.plan_id);
  const active = ACTIVE_STATUSES.has(profile.subscription_status ?? "");
  const notice = typeof checkout === "string" ? NOTICES[checkout] : undefined;

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-16 md:px-8 md:pt-24">
      <SectionHead
        level={1}
        scene={1}
        label="Account"
        title={
          <>
            Your <em>call sheet.</em>
          </>
        }
        aside={`Signed in as ${profile.email}`}
      />

      {notice && (
        <p role="status" className="slate mt-10 border border-rec/60 bg-rec/10 px-4 py-3 text-paper">
          {notice}
        </p>
      )}
      {billing === "error" && (
        <p role="alert" className="slate mt-10 border border-white-16 px-4 py-3 text-white-70">
          The billing portal isn&apos;t available right now. Try again in a moment.
        </p>
      )}

      <div className="mt-14 grid gap-px border border-white-10 bg-white-10 md:grid-cols-3">
        <div className="bg-ink p-6 md:p-8">
          <p className="slate text-white-40">Credits</p>
          <p className="display mt-4 text-7xl">{profile.credits.toLocaleString()}</p>
          <Link href="/create" className="slate mt-6 inline-block text-rec">
            Spend them in the studio →
          </Link>
        </div>

        <div className="bg-ink p-6 md:p-8">
          <p className="slate text-white-40">Plan</p>
          <p className="display mt-4 text-5xl">{plan && active ? plan.name : "No plan"}</p>
          <p className="slate mt-3 text-white-60">
            {plan && active
              ? `${profile.plan_interval} · ${profile.subscription_status} · renews ${formatDate(profile.current_period_end)}`
              : "Pay as you go with credit packs, or pick a plan."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {profile.stripe_customer_id && (
              <form action="/api/billing/portal" method="post">
                <Button type="submit" variant="outline" size="sm">
                  Manage billing
                </Button>
              </form>
            )}
            <Button href="/pricing" variant={active ? "ghost" : "primary"} size="sm">
              {active ? "Compare plans" : "See plans"}
            </Button>
          </div>
        </div>

        <div className="bg-ink p-6 md:p-8">
          <p className="slate text-white-40">Profile</p>
          <p className="display mt-4 text-4xl">{profile.full_name || profile.email.split("@")[0]}</p>
          <dl className="slate mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-white-60">
            <dt className="text-white-40">Email</dt>
            <dd className="truncate normal-case tracking-normal">{profile.email}</dd>
            <dt className="text-white-40">Sign-in</dt>
            <dd>{profile.provider}</dd>
          </dl>
        </div>
      </div>

      <section className="mt-20" aria-labelledby="takes">
        <div className="flex items-center justify-between">
          <h2 id="takes" className="slate text-white-40">
            Recent takes
          </h2>
          <Link href="/create" className="slate text-rec">
            Studio →
          </Link>
        </div>
        {takes.length ? (
          <ul className="mt-4 grid grid-cols-2 gap-px border border-white-10 bg-white-10 sm:grid-cols-3 lg:grid-cols-5">
            {takes.map((g) => {
              const first = ((g.results ?? []) as JobResult[])[0];
              return (
                <li key={g.id} className="bg-ink">
                  <div className="relative aspect-video overflow-hidden bg-ink-raised">
                    {first ? (
                      <Media media={first.media} alt={g.prompt} sizes="(min-width: 1024px) 20vw, 50vw" />
                    ) : (
                      <span className="slate absolute inset-0 flex items-center justify-center text-white-40">
                        {g.status === "running" ? "Rolling…" : g.status}
                      </span>
                    )}
                  </div>
                  <p className="truncate px-3 pt-2 text-sm text-paper" title={g.prompt}>
                    {g.prompt}
                  </p>
                  <p className="slate px-3 pb-3 pt-1 text-white-40">
                    {g.type} · {formatDate(g.created_at)} · {g.cost} cr
                  </p>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-4 border border-white-10 px-4 py-6 text-sm text-white-60">
            No takes yet.{" "}
            <Link href="/create" className="text-paper underline decoration-rec underline-offset-4">
              Roll your first one
            </Link>
          </p>
        )}
      </section>

      <section className="mt-16" aria-labelledby="purchases">
        <h2 id="purchases" className="slate text-white-40">
          Purchases
        </h2>
        {purchases?.length ? (
          <div className="mt-4 overflow-x-auto border border-white-10" data-lenis-prevent>
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="slate text-white-40">
                <tr className="border-b border-white-10">
                  <th className="px-4 py-3 font-normal">Date</th>
                  <th className="px-4 py-3 font-normal">Item</th>
                  <th className="px-4 py-3 font-normal">Type</th>
                  <th className="px-4 py-3 text-right font-normal">Amount</th>
                  <th className="px-4 py-3 text-right font-normal">Credits</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((t) => (
                  <tr key={t.id} className="border-b border-white-8 last:border-0">
                    <td className="px-4 py-3 text-white-60">{formatDate(t.created_at)}</td>
                    <td className="px-4 py-3 text-paper">
                      {t.kind === "credit_pack"
                        ? (getPack(t.plan_id)?.label ?? t.plan_id)
                        : (getPlan(t.plan_id)?.name ?? t.plan_id ?? "—")}
                      {t.plan_interval && <span className="text-white-40"> · {t.plan_interval}</span>}
                    </td>
                    <td className="px-4 py-3 text-white-60">{KIND_LABEL[t.kind] ?? t.kind}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatMoney(t.amount, t.currency)}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-white-60">{formatCredits(t.credits_granted)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-4 border border-white-10 px-4 py-6 text-sm text-white-60">
            No purchases yet.{" "}
            <Link href="/pricing" className="text-paper underline decoration-rec underline-offset-4">
              See plans
            </Link>
          </p>
        )}
      </section>

      <section className="mt-16" aria-labelledby="activity">
        <h2 id="activity" className="slate text-white-40">
          Credit activity
        </h2>
        <ul className="mt-4 border border-white-10">
          {(ledger ?? []).map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-4 border-b border-white-8 px-4 py-3 text-sm last:border-0">
              <span className="text-white-60">{formatDate(e.created_at, true)}</span>
              <span className="flex-1 text-paper">{REASON_LABEL[e.reason] ?? e.reason}</span>
              <span className={cn("tabular-nums", e.delta > 0 ? "text-paper" : "text-white-60")}>
                {formatCredits(e.delta)}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
