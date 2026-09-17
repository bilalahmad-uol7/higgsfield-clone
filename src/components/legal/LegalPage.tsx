import Link from "next/link";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-14 md:px-6">
      <h1 className="hf-heading text-2xl font-medium sm:text-3xl">{title}</h1>
      <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-white-70">{children}</div>
      <Link
        href="/"
        className="mt-8 inline-block rounded-pill border border-white-16 px-5 py-2.5 text-sm font-medium text-white-90 hover:bg-white-6"
      >
        Back to home
      </Link>
    </div>
  );
}
