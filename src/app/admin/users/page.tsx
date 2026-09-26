import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/session";
import { getPlan } from "@/lib/stripe/catalog";
import { formatDate } from "@/lib/format";
import { Pagination, Pill, Table, Td, Th, pageParam } from "@/components/admin/ui";
import { UserActions } from "@/components/admin/UserActions";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 25;

export default async function AdminUsers({ searchParams }: PageProps<"/admin/users">) {
  const me = await requireAdmin();
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q.trim().slice(0, 100) : "";
  const page = pageParam(params.page);
  const db = createAdminClient();

  let query = db
    .from("profiles")
    .select(
      "id, email, full_name, provider, role, credits, plan_id, plan_interval, subscription_status, created_at",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  // Escape LIKE wildcards so a search for "a_b" is literal.
  if (q) query = query.or(`email.ilike.%${q.replace(/[%_,()]/g, "\\$&")}%,full_name.ilike.%${q.replace(/[%_,()]/g, "\\$&")}%`);

  const [{ data: rows, count }, lastSeen] = await Promise.all([
    query,
    // Last sign-in lives in auth.users, only reachable via the Admin API.
    db.auth.admin.listUsers({ page: 1, perPage: 1000 }),
  ]);
  const lastSignIn = new Map((lastSeen.data?.users ?? []).map((u) => [u.id, u.last_sign_in_at]));

  const href = (p: number) => `/admin/users?${new URLSearchParams({ ...(q && { q }), page: String(p) })}`;

  return (
    <div>
      <form className="mb-6 flex max-w-md" role="search">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search email or name"
          aria-label="Search users"
          className="flex-1 border border-white-16 bg-ink px-4 py-3 text-sm text-paper placeholder:text-white-40 focus:border-rec focus:outline-none"
        />
        <button type="submit" className="slate border border-l-0 border-white-16 px-4 text-white-70 hover:text-paper">
          Search
        </button>
      </form>

      <Table
        minWidth={1100}
        head={
          <>
            <Th>User</Th>
            <Th>Via</Th>
            <Th>Role</Th>
            <Th>Plan</Th>
            <Th right>Credits</Th>
            <Th>Joined</Th>
            <Th>Last sign-in</Th>
            <Th right>Manage</Th>
          </>
        }
      >
        {(rows ?? []).length === 0 && (
          <tr>
            <td colSpan={8} className="px-4 py-8 text-white-40">
              {q ? `No users match “${q}”.` : "No users yet."}
            </td>
          </tr>
        )}
        {(rows ?? []).map((u) => (
          <tr key={u.id}>
            <Td>
              {u.full_name || "—"}
              <span className="block text-xs text-white-40">{u.email}</span>
            </Td>
            <Td muted>{u.provider}</Td>
            <Td>{u.role === "admin" ? <Pill tone="rec">Admin</Pill> : <Pill>User</Pill>}</Td>
            <Td muted>
              {u.plan_id ? `${getPlan(u.plan_id)?.name ?? u.plan_id} · ${u.plan_interval}` : "—"}
              {u.subscription_status && <span className="block text-xs text-white-40">{u.subscription_status}</span>}
            </Td>
            <Td right>{u.credits.toLocaleString()}</Td>
            <Td muted>{formatDate(u.created_at)}</Td>
            <Td muted>{formatDate(lastSignIn.get(u.id), true)}</Td>
            <td className="px-4 py-3">
              <UserActions userId={u.id} isAdmin={u.role === "admin"} isSelf={u.id === me.id} />
            </td>
          </tr>
        ))}
      </Table>
      <Pagination page={page} pageSize={PAGE_SIZE} total={count ?? 0} href={href} />
    </div>
  );
}
