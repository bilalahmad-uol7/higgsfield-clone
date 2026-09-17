import Link from "next/link";

const FOOTER_LINKS = [
  { label: "Help center", href: "/creator-hub/help-center" },
  { label: "Cookie Notice", href: "/cookie-notice" },
  { label: "Terms", href: "/terms-of-use-agreement" },
  { label: "Privacy", href: "/privacy-policy" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-white-8 bg-surface-tertiary">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-white-60 sm:flex-row md:px-6">
        <p>&copy; 2026 Higgsfield, Inc. All rights reserved.</p>
        <nav className="flex items-center gap-5">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-white-90">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
