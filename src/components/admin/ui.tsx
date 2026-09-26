import Link from "next/link";
import { cn } from "@/lib/cn";

export function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-ink p-6">
      <p className="slate text-white-40">{label}</p>
      <p className="display mt-3 text-5xl tabular-nums">{value}</p>
      {hint && <p className="slate mt-2 text-white-40">{hint}</p>}
    </div>
  );
}

export function Th({ children, right }: { children: React.ReactNode; right?: boolean }) {
  return <th className={cn("px-4 py-3 font-normal", right && "text-right")}>{children}</th>;
}

export function Td({ children, right, muted }: { children: React.ReactNode; right?: boolean; muted?: boolean }) {
  return (
    <td className={cn("px-4 py-3 align-middle", right && "text-right tabular-nums", muted ? "text-white-60" : "text-paper")}>
      {children}
    </td>
  );
}

export function Table({ head, children, minWidth = 900 }: { head: React.ReactNode; children: React.ReactNode; minWidth?: number }) {
  return (
    <div className="overflow-x-auto border border-white-10" data-lenis-prevent>
      <table className="w-full text-left text-sm" style={{ minWidth }}>
        <thead className="slate text-white-40">
          <tr className="border-b border-white-10">{head}</tr>
        </thead>
        <tbody className="[&>tr]:border-b [&>tr]:border-white-8 [&>tr:last-child]:border-0">{children}</tbody>
      </table>
    </div>
  );
}

export function Pagination({
  page,
  pageSize,
  total,
  href,
}: {
  page: number;
  pageSize: number;
  total: number;
  href: (page: number) => string;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const btn = "slate border border-white-16 px-3 py-2 transition-colors hover:border-paper";
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <p className="slate text-white-40">
        {from}–{to} of {total.toLocaleString()}
      </p>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link className={btn} href={href(page - 1)}>
            ← Prev
          </Link>
        ) : (
          <span className={cn(btn, "opacity-30")}>← Prev</span>
        )}
        {page < pages ? (
          <Link className={btn} href={href(page + 1)}>
            Next →
          </Link>
        ) : (
          <span className={cn(btn, "opacity-30")}>Next →</span>
        )}
      </div>
    </div>
  );
}

export function Pill({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "rec" | "paper" }) {
  return (
    <span
      className={cn(
        "slate inline-block px-1.5 py-1",
        tone === "rec" && "bg-rec text-ink",
        tone === "paper" && "bg-paper text-ink",
        tone === "neutral" && "border border-white-16 text-white-60",
      )}
    >
      {children}
    </span>
  );
}

export function pageParam(v: string | string[] | undefined) {
  const n = Number(typeof v === "string" ? v : 1);
  return Number.isInteger(n) && n > 0 ? n : 1;
}
