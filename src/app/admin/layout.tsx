import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/session";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

// Server-side gate for every /admin page: non-admins get a 404. The proxy
// redirect is only a convenience; this is the real check.
export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const admin = await requireAdmin();
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-12 md:px-8">
      <div className="flex flex-col gap-6 border-b border-white-10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="slate flex items-center gap-3 text-white-60">
            <span className="text-rec">Control room</span>
            <span className="h-px w-8 bg-white-24" />
            {admin.email}
          </p>
          <h1 className="display mt-4 text-5xl md:text-6xl">
            Admin <em>panel.</em>
          </h1>
        </div>
        <AdminNav />
      </div>
      <div className="mt-10">{children}</div>
    </div>
  );
}
