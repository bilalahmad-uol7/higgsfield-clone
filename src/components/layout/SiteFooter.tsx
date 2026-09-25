import Link from "next/link";
import { NAV, isGroup } from "@/data/nav";
import { Timecode } from "@/components/motion/Timecode";

const LEGAL = [
  { label: "Help center", href: "/creator-hub/help-center" },
  { label: "Cookie notice", href: "/cookie-notice" },
  { label: "Terms", href: "/terms-of-use-agreement" },
  { label: "Privacy", href: "/privacy-policy" },
];

const COLUMNS = [
  ...NAV.filter(isGroup).map((g) => ({ title: g.label, links: g.children })),
  {
    title: "Company",
    links: NAV.filter((i) => !isGroup(i)).map((i) => ({ label: i.label, href: "href" in i ? i.href : "/" })),
  },
];

// Styled as a film's end credits: role/name columns, then the title card.
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white-8 bg-ink">
      <div className="mx-auto max-w-[1440px] px-4 pt-20 md:px-8">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <p className="slate text-rec">End credits</p>
            <p className="display mt-4 text-4xl">
              Directed by <em>you.</em>
            </p>
            <p className="mt-3 text-sm text-white-40">
              Higgsfield is the studio in your browser — every model, every camera move, one prompt away.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-10 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <p className="slate text-white-40">{col.title}</p>
                <ul className="mt-4 flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-white-70 transition-colors hover:text-paper">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white-8 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="slate text-white-40">
            &copy; 2026 Higgsfield, Inc. · Redesign concept · <Timecode className="text-white-60" />
          </p>
          <nav className="flex flex-wrap gap-5">
            {LEGAL.map((link) => (
              <Link key={link.label} href={link.href} className="slate text-white-40 transition-colors hover:text-paper">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <p
        aria-hidden
        className="display pointer-events-none select-none whitespace-nowrap text-center text-[22vw] leading-[0.78] text-paper/[0.06]"
      >
        Higgsfield
      </p>
    </footer>
  );
}
