import { Button } from "@/components/ui/Button";

export function LegalPage({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-24 pt-16 md:px-8 md:pt-24">
      <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-20">
        <div>
          <p className="slate flex items-center gap-3 text-white-60">
            <span className="text-rec">Fine print</span>
            <span className="h-px w-8 bg-white-24" />
            Higgsfield
          </p>
          <h1 className="display mt-5 text-5xl sm:text-6xl">{title}</h1>
        </div>
        <div>
          <div className="flex max-w-2xl flex-col gap-4 border-t border-white-10 pt-6 leading-relaxed text-white-70">
            {children}
          </div>
          <Button href="/" variant="outline" className="mt-10">
            Back to home
          </Button>
        </div>
      </div>
    </div>
  );
}
