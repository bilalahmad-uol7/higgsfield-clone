import Link from "next/link";
import { PROMO_BAR } from "@/data/landing";
import { Media } from "@/components/ui/Media";

export function PromoBar() {
  return (
    <section className="mx-auto mt-6 max-w-[1400px] px-4 md:px-6">
      <div className="relative overflow-hidden rounded-2xl border border-white-8 bg-surface-primary">
        <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-sm text-white-60">{PROMO_BAR.eyebrow}</p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {PROMO_BAR.items.map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-xl bg-white-4 px-4 py-2.5">
                  <span className="text-sm font-medium text-white-90">{item.title}</span>
                  <span className="text-xs text-lime">{item.cta}</span>
                </div>
              ))}
            </div>
          </div>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-pill bg-lime px-5 py-3 text-sm font-semibold text-black whitespace-nowrap hover:brightness-95"
          >
            {PROMO_BAR.cta}
          </Link>
        </div>
        <div className="relative hidden h-40 w-full overflow-hidden sm:block">
          <Media media={PROMO_BAR.media} poster={PROMO_BAR.poster} alt="Seedance 2.5 promotion" />
        </div>
      </div>
    </section>
  );
}
