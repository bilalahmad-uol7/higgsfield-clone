// Instant placeholder for signed-in pages while their data streams in.
// Used by route `loading.tsx` files, which Next prefetches with each link,
// so navigation paints immediately instead of waiting on the server.
export function PageSkeleton({ label, variant = "page" }: { label: string; variant?: "page" | "studio" | "panel" }) {
  const block = "animate-pulse bg-white-6";
  return (
    <div
      aria-busy
      aria-label={`Loading ${label}`}
      className={variant === "panel" ? "" : "mx-auto max-w-[1440px] px-4 pb-20 pt-10 md:px-8"}
    >
      {variant !== "panel" && (
        <div className="border-b border-white-10 pb-6">
          <p className="slate text-white-40">{label}</p>
          <div className={`mt-4 h-14 w-72 max-w-full ${block}`} />
        </div>
      )}
      {variant === "studio" ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[380px_1fr]">
          <div className={`h-[560px] border border-white-10 ${block}`} />
          <div className={`aspect-video border border-white-10 ${block}`} />
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-px border border-white-10 bg-white-10">
          <div className={`h-40 ${block}`} />
          <div className={`h-64 ${block}`} />
        </div>
      )}
    </div>
  );
}
